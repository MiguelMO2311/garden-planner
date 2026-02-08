# app/services/agro_alerts.py

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.plot import Plot
from app.models.cultivo_parcela import CultivoParcela
from app.services.weather_service import get_real_weather
from app.services.evento_sanitario import procesar_evento_sanitario


# ============================================================
# OBJETO CLIMÁTICO PARA EL MOTOR SANITARIO
# ============================================================

class EventoClimaInput:
    """
    Objeto estándar que consume el motor sanitario.
    - type: tipo de evento climático (lluvia, helada, calor, viento, humedad…)
    - risk_level: bajo / medio / alto
    - intensity: valor numérico (mm, ºC, %, km/h)
    """
    def __init__(self, tipo, riesgo, intensidad):
        self.type = tipo
        self.risk_level = riesgo
        self.intensity = intensidad


# ============================================================
# CONSTRUCTOR DE CONTEXTO SANITARIO
# ============================================================

def construir_contexto(cultivo: "CultivoParcela") -> dict:
    """
    Construye el contexto sanitario que el motor de reglas necesita.
    Extrae datos del cultivo si existen.
    """
    return {
        "suelo": getattr(cultivo, "suelo_tipo", None),
        "fase": getattr(cultivo, "fase_fenologica", None),
        "historial": getattr(cultivo, "historial_sanitario", None),
        "densidad": getattr(cultivo, "densidad", None),
        "manejo": getattr(cultivo, "estado_manejo", None),
        "ventilacion": getattr(cultivo, "ventilacion", None),
        "compactacion": getattr(cultivo, "compactacion", None),
        "drenaje": getattr(cultivo, "drenaje", None),
        "pendiente": getattr(cultivo, "pendiente", None),
        "sensibilidad": getattr(cultivo, "sensibilidad_general", None),
    }


# ============================================================
# FUNCIÓN DE RIEGO (SE MANTIENE IGUAL)
# ============================================================

def _mensaje_riego(cultivo: CultivoParcela, lluvia_mm: float) -> str:
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"

    if cultivo.litros_agua_semana is None or cultivo.litros_agua_semana <= 0:
        return "Revisar riego manualmente (no hay dato de litros_agua_semana)."

    riego_diario = cultivo.litros_agua_semana / 7.0

    if lluvia_mm >= riego_diario * 0.8:
        return (
            f"No regar: la lluvia prevista ({lluvia_mm:.1f} mm) cubre casi toda la "
            f"necesidad diaria de {nombre_cultivo}."
        )
    elif lluvia_mm >= riego_diario * 0.4:
        return (
            f"Reducir riego: la lluvia prevista ({lluvia_mm:.1f} mm) cubre parte de la "
            f"necesidad diaria de {nombre_cultivo}."
        )
    else:
        return (
            f"Regar normalmente: la lluvia prevista ({lluvia_mm:.1f} mm) no cubre la "
            f"necesidad diaria de {nombre_cultivo}."
        )


# ============================================================
# GENERADOR DE ALERTAS SEMANALES (INTEGRADO CON MOTOR SANITARIO)
# ============================================================

async def generar_alertas_semanales(db: Session) -> List[Dict[str, Any]]:
    alertas = []

    parcelas = db.query(Plot).all()

    for parcela in parcelas:
        if parcela.lat is None or parcela.lng is None:
            continue

        cultivos = parcela.cultivos or []
        if not cultivos:
            continue

        try:
            clima = await get_real_weather(parcela.lat, parcela.lng)
        except Exception:
            continue

        daily = clima.get("daily") or []
        current = clima.get("current") or {}
        viento_actual = current.get("wind_speed", 0.0)
        humedad_actual = current.get("humidity", None)

        for dia in daily:
            dt_str = dia.get("dt")
            try:
                fecha = datetime.fromisoformat(dt_str).date() if dt_str else None
            except Exception:
                fecha = None

            temp = dia.get("temp") or {}
            temp_max = temp.get("max")
            temp_min = temp.get("min")
            lluvia_mm = dia.get("precipitation_sum", 0.0) or 0.0

            for cultivo in cultivos:

                nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"
                contexto = construir_contexto(cultivo)

                # ============================================================
                # 🌧 LLUVIA
                # ============================================================

                if lluvia_mm >= 40:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "lluvia",
                        "mensaje": f"Lluvia intensa prevista ({lluvia_mm:.1f} mm).",
                        "nivel": "danger",
                    })

                    evento = EventoClimaInput("lluvia", "high", lluvia_mm)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                elif lluvia_mm >= 20:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "lluvia",
                        "mensaje": f"Lluvia moderada prevista ({lluvia_mm:.1f} mm).",
                        "nivel": "warning",
                    })

                    evento = EventoClimaInput("lluvia", "medium", lluvia_mm)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                elif lluvia_mm >= 10:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "lluvia",
                        "mensaje": f"Lluvia ligera prevista ({lluvia_mm:.1f} mm).",
                        "nivel": "info",
                    })

                    evento = EventoClimaInput("lluvia", "low", lluvia_mm)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                # ============================================================
                # 💧 RIEGO
                # ============================================================

                alertas.append({
                    "plot_id": parcela.id,
                    "plot_name": parcela.name,
                    "cultivo_id": cultivo.id,
                    "cultivo_name": nombre_cultivo,
                    "fecha": fecha.isoformat(),
                    "tipo": "riego",
                    "mensaje": _mensaje_riego(cultivo, lluvia_mm),
                    "nivel": "info",
                })

                # ============================================================
                # ❄ HELADA
                # ============================================================

                if temp_min is not None:
                    if temp_min <= -2:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "helada",
                            "mensaje": f"Helada severa prevista ({temp_min:.1f}°C).",
                            "nivel": "danger",
                        })

                        evento = EventoClimaInput("helada", "high", temp_min)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                    elif temp_min < 0:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "helada",
                            "mensaje": f"Helada ligera prevista ({temp_min:.1f}°C).",
                            "nivel": "warning",
                        })

                        evento = EventoClimaInput("helada", "medium", temp_min)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                # ============================================================
                # 🔥 CALOR
                # ============================================================

                if temp_max is not None:
                    if temp_max >= 35:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "calor",
                            "mensaje": f"Calor extremo previsto ({temp_max:.1f}°C).",
                            "nivel": "danger",
                        })

                        evento = EventoClimaInput("calor_extremo", "high", temp_max)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                    elif temp_max >= 32:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "calor",
                            "mensaje": f"Ola de calor prevista ({temp_max:.1f}°C).",
                            "nivel": "warning",
                        })

                        evento = EventoClimaInput("ola_de_calor", "medium", temp_max)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                # ============================================================
                # 💨 VIENTO
                # ============================================================

                if viento_actual >= 80:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "viento",
                        "mensaje": f"Viento muy fuerte ({viento_actual:.1f} km/h).",
                        "nivel": "danger",
                    })

                    evento = EventoClimaInput("viento_muy_fuerte", "high", viento_actual)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                elif viento_actual >= 60:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "viento",
                        "mensaje": f"Viento fuerte ({viento_actual:.1f} km/h).",
                        "nivel": "warning",
                    })

                    evento = EventoClimaInput("viento_fuerte", "medium", viento_actual)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                elif viento_actual >= 40:
                    alertas.append({
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat(),
                        "tipo": "viento",
                        "mensaje": f"Viento moderado ({viento_actual:.1f} km/h).",
                        "nivel": "info",
                    })

                    evento = EventoClimaInput("viento_moderado", "low", viento_actual)
                    procesar_evento_sanitario(db, cultivo, evento, contexto)

                # ============================================================
                # 🌫 HUMEDAD
                # ============================================================

                if humedad_actual is not None:
                    if humedad_actual >= 90:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "humedad",
                            "mensaje": f"Humedad muy alta ({humedad_actual}%). Riesgo elevado de hongos.",
                            "nivel": "danger",
                        })

                        evento = EventoClimaInput("humedad", "high", humedad_actual)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                    elif humedad_actual >= 80:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "humedad",
                            "mensaje": f"Humedad elevada ({humedad_actual}%). Posible riesgo de mildiu.",
                            "nivel": "warning",
                        })

                        evento = EventoClimaInput("humedad", "medium", humedad_actual)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

                    elif humedad_actual >= 70:
                        alertas.append({
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat(),
                            "tipo": "humedad",
                            "mensaje": f"Humedad moderada ({humedad_actual}%). Vigilar hongos foliares.",
                            "nivel": "info",
                        })

                        evento = EventoClimaInput("humedad", "low", humedad_actual)
                        procesar_evento_sanitario(db, cultivo, evento, contexto)

    alertas.sort(key=lambda a: (a["fecha"], a["plot_name"], a["cultivo_name"]))
    return alertas
