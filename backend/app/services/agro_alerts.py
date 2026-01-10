# app/services/agro_alerts.py

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.plot import Plot
from app.models.cultivo_parcela import CultivoParcela
from app.services.weather_service import get_real_weather


def _nivel_from_tipo(tipo: str) -> str:
    if tipo in ("helada", "calor_extremo", "viento_fuerte"):
        return "danger"
    if tipo in ("lluvia", "riego"):
        return "warning"
    return "info"


def _mensaje_riego(cultivo: CultivoParcela, lluvia_mm: float) -> str:
    """
    Genera un mensaje de riego basado en litros_agua_semana y lluvia prevista.
    """
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


async def generar_alertas_semanales(db: Session) -> List[Dict[str, Any]]:
    """
    Genera alertas agrícolas combinando clima real y cultivos por parcela.
    """
    alertas: List[Dict[str, Any]] = []

    parcelas: List[Plot] = db.query(Plot).all()

    for parcela in parcelas:
        if parcela.lat is None or parcela.lng is None:
            continue

        cultivos: List[CultivoParcela] = parcela.cultivos or []
        if not cultivos:
            continue

        try:
            clima = await get_real_weather(parcela.lat, parcela.lng)
        except Exception as e:
            print(f"[agro_alerts] Error obteniendo clima para parcela {parcela.id}: {e}")
            continue

        daily = clima.get("daily") or []
        current = clima.get("current") or {}
        viento_actual = current.get("wind_speed", 0.0)

        for dia in daily:
            dt_str = dia.get("dt")
            try:
                fecha = datetime.fromisoformat(dt_str).date() if dt_str else None
            except Exception:
                fecha = None

            temp = dia.get("temp") or {}
            temp_max = temp.get("max")
            temp_min = temp.get("min")
            pop = dia.get("pop", 0.0)
            lluvia_mm = dia.get("precipitation_sum", 0.0) or 0.0

            for cultivo in cultivos:
                nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"

                # --- Lluvia ---
                if pop is not None and pop >= 0.5:
                    alertas.append(
                        {
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat() if fecha else dt_str,
                            "tipo": "lluvia",
                            "mensaje": (
                                f"Lluvia prevista (probabilidad {int(pop * 100)}%) "
                                f"en {parcela.name}."
                            ),
                            "nivel": "warning",
                        }
                    )

                # --- Riego ---
                mensaje_riego = _mensaje_riego(cultivo, lluvia_mm)
                alertas.append(
                    {
                        "plot_id": parcela.id,
                        "plot_name": parcela.name,
                        "cultivo_id": cultivo.id,
                        "cultivo_name": nombre_cultivo,
                        "fecha": fecha.isoformat() if fecha else dt_str,
                        "tipo": "riego",
                        "mensaje": mensaje_riego,
                        "nivel": "info",
                    }
                )

                # --- Helada ---
                if temp_min is not None and temp_min <= 0:
                    alertas.append(
                        {
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat() if fecha else dt_str,
                            "tipo": "helada",
                            "mensaje": (
                                f"Helada prevista ({temp_min:.1f}°C) en {parcela.name}. "
                                f"Riesgo para {nombre_cultivo}."
                            ),
                            "nivel": "danger",
                        }
                    )

                # --- Ola de calor ---
                if temp_max is not None and temp_max >= 32:
                    alertas.append(
                        {
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat() if fecha else dt_str,
                            "tipo": "calor",
                            "mensaje": (
                                f"Ola de calor prevista ({temp_max:.1f}°C) en {parcela.name}. "
                                f"Posible estrés hídrico en {nombre_cultivo}."
                            ),
                            "nivel": "warning",
                        }
                    )

                # --- Viento fuerte ---
                if viento_actual and viento_actual >= 40:
                    alertas.append(
                        {
                            "plot_id": parcela.id,
                            "plot_name": parcela.name,
                            "cultivo_id": cultivo.id,
                            "cultivo_name": nombre_cultivo,
                            "fecha": fecha.isoformat() if fecha else dt_str,
                            "tipo": "viento",
                            "mensaje": (
                                f"Viento fuerte actual ({viento_actual:.1f} km/h) en {parcela.name}. "
                                f"Revisar tutores y evitar tratamientos en {nombre_cultivo}."
                            ),
                            "nivel": "warning",
                        }
                    )

    alertas.sort(key=lambda a: (a.get("fecha") or "", a["plot_name"], a["cultivo_name"]))
    return alertas
