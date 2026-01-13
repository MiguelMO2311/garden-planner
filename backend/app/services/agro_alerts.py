# app/services/agro_alerts.py

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.plot import Plot
from app.models.cultivo_parcela import CultivoParcela
from app.services.weather_service import get_real_weather


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

                # 🌧 LLUVIA
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

                # 💧 RIEGO
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

                # ❄ HELADA
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

                # 🔥 CALOR
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

                # 💨 VIENTO
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

    alertas.sort(key=lambda a: (a["fecha"], a["plot_name"], a["cultivo_name"]))
    return alertas
