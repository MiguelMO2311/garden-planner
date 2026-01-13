import random
from datetime import timedelta, date
from sqlalchemy.orm import Session

from app.models.plot import Plot
from app.models.climate_event import ClimateEvent


# ---------------------------------------------------------
# GENERACIÓN ALEATORIA (modo demo)
# ---------------------------------------------------------
EVENT_TYPES = [
    "lluvia",
    "tormenta",
    "granizo",
    "ola_de_calor",
    "helada",
    "viento_fuerte",
]


def generar_eventos_climaticos(
    db: Session,
    start_date: date,
    end_date: date,
    probabilidad: float = 0.2
):
    parcelas = db.query(Plot).all()
    eventos_creados = []

    for parcela in parcelas:
        current = start_date

        while current <= end_date:
            if random.random() < probabilidad:
                tipo = random.choice(EVENT_TYPES)

                evento = ClimateEvent(
                    plot_id=parcela.id,
                    date=current,
                    type=tipo,
                    intensity=round(random.uniform(0.1, 1.0), 2),
                    description=generar_descripcion(tipo),
                    risk_level="none",  # modo demo no genera riesgo real
                )

                db.add(evento)
                eventos_creados.append(evento)

            current += timedelta(days=1)

    db.commit()
    return eventos_creados


def generar_descripcion(tipo: str) -> str:
    descripciones = {
        "lluvia": "Lluvia moderada que puede beneficiar el riego natural.",
        "tormenta": "Tormenta intensa con riesgo de daños en cultivos.",
        "granizo": "Caída de granizo que puede afectar hojas y frutos.",
        "ola_de_calor": "Temperaturas muy altas que pueden causar estrés hídrico.",
        "helada": "Temperaturas bajo cero con riesgo de daño en brotes.",
        "viento_fuerte": "Rachas fuertes que pueden tumbar plantas jóvenes.",
    }
    return descripciones.get(tipo, "Evento climático inesperado.")


# ---------------------------------------------------------
# GENERACIÓN REAL AGRONÓMICA (Open‑Meteo)
# ---------------------------------------------------------
async def generar_eventos_reales(db: Session, days: int = 3):
    from app.services.weather_service import get_real_weather

    parcelas = db.query(Plot).all()
    eventos_creados = []

    for parcela in parcelas:
        if parcela.lat is None or parcela.lng is None:
            continue

        clima = await get_real_weather(parcela.lat, parcela.lng)

        for dia in clima["daily"]:
            fecha = date.fromisoformat(dia["dt"])
            temp_max = dia["temp"]["max"]
            temp_min = dia["temp"]["min"]
            lluvia_mm = dia.get("precipitation_sum", 0.0) or 0.0
            viento = clima["current"]["wind_speed"]

            # -------------------------
            # 🌧 LLUVIA — umbrales agrícolas reales
            # -------------------------
            if lluvia_mm > 40:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="lluvia",
                        intensity=round(min(lluvia_mm / 80, 1), 2),
                        description=f"Lluvia muy intensa ({lluvia_mm:.1f} mm). Riesgo de anegamiento o erosión.",
                        risk_level="high",
                    )
                )
            elif lluvia_mm >= 20:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="lluvia",
                        intensity=round(min(lluvia_mm / 60, 1), 2),
                        description=f"Lluvia fuerte ({lluvia_mm:.1f} mm). Posibles hongos o compactación.",
                        risk_level="medium",
                    )
                )

            # -------------------------
            # ❄ HELADA
            # -------------------------
            if temp_min < -2:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="helada",
                        intensity=round(min(abs(temp_min) / 8, 1), 2),
                        description=f"Helada severa ({temp_min:.1f}°C). Daño alto en brotes.",
                        risk_level="high",
                    )
                )
            elif temp_min < 0:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="helada",
                        intensity=round(min(abs(temp_min) / 4, 1), 2),
                        description=f"Helada ligera ({temp_min:.1f}°C). Daño moderado.",
                        risk_level="medium",
                    )
                )

            # -------------------------
            # 🔥 OLA DE CALOR
            # -------------------------
            if temp_max > 35:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="ola_de_calor",
                        intensity=round(min((temp_max - 32) / 10, 1), 2),
                        description=f"Calor extremo ({temp_max:.1f}°C). Estrés hídrico severo.",
                        risk_level="high",
                    )
                )
            elif temp_max >= 32:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="ola_de_calor",
                        intensity=round(min((temp_max - 30) / 10, 1), 2),
                        description=f"Ola de calor moderada ({temp_max:.1f}°C).",
                        risk_level="medium",
                    )
                )

            # -------------------------
            # 💨 VIENTO
            # -------------------------
            if viento > 70:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="viento_fuerte",
                        intensity=round(min(viento / 100, 1), 2),
                        description=f"Viento muy fuerte ({viento:.1f} km/h). Riesgo de daños.",
                        risk_level="high",
                    )
                )
            elif viento >= 50:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="viento_fuerte",
                        intensity=round(min(viento / 80, 1), 2),
                        description=f"Viento fuerte ({viento:.1f} km/h).",
                        risk_level="medium",
                    )
                )

    for ev in eventos_creados:
        db.add(ev)

    db.commit()
    return eventos_creados
