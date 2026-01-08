import random
from datetime import timedelta, date
from sqlalchemy.orm import Session

from app.models.plot import Plot
from app.models.climate_event import ClimateEvent

# Tipos de eventos climáticos posibles
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
    """
    Genera eventos climáticos para cada parcela y los guarda en la base de datos.
    """

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
                )

                db.add(evento)
                eventos_creados.append(evento)

            current += timedelta(days=1)

    db.commit()
    return eventos_creados


def generar_descripcion(tipo: str) -> str:
    """Devuelve una descripción automática según el tipo de evento."""

    descripciones = {
        "lluvia": "Lluvia moderada que puede beneficiar el riego natural.",
        "tormenta": "Tormenta intensa con riesgo de daños en cultivos.",
        "granizo": "Caída de granizo que puede afectar hojas y frutos.",
        "ola_de_calor": "Temperaturas muy altas que pueden causar estrés hídrico.",
        "helada": "Temperaturas bajo cero con riesgo de daño en brotes.",
        "viento_fuerte": "Rachas fuertes que pueden tumbar plantas jóvenes.",
    }

    return descripciones.get(tipo, "Evento climático inesperado.")

async def generar_eventos_reales(db: Session, days: int = 3):
    """
    Genera eventos climáticos reales basados en Open‑Meteo
    para cada parcela con lat/lon.
    """
    from app.services.weather_service import get_real_weather

    parcelas = db.query(Plot).all()
    eventos_creados = []

    for parcela in parcelas:
        if parcela.lat is None or parcela.lng is None:
            continue  # no se puede obtener clima real

        # Obtener clima real
        clima = await get_real_weather(parcela.lat, parcela.lng)

        # Procesar clima diario
        for dia in clima["daily"]:
            fecha = date.fromisoformat(dia["dt"])
            temp_max = dia["temp"]["max"]
            temp_min = dia["temp"]["min"]
            pop = dia["pop"]  # probabilidad de precipitación (0–1)

            # --- Detectar eventos reales ---
            # Lluvia
            if pop > 0.6:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="lluvia",
                        intensity=round(pop, 2),
                        description="Alta probabilidad de lluvia según Open‑Meteo",
                    )
                )

            # Ola de calor
            if temp_max >= 32:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="ola_de_calor",
                        intensity=min((temp_max - 30) / 10, 1),
                        description="Temperaturas muy altas detectadas",
                    )
                )

            # Helada
            if temp_min <= 0:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="helada",
                        intensity=min(abs(temp_min) / 10, 1),
                        description="Temperaturas bajo cero detectadas",
                    )
                )

            # Viento fuerte (solo en clima actual)
            viento = clima["current"]["wind_speed"]
            if viento >= 40:
                eventos_creados.append(
                    ClimateEvent(
                        plot_id=parcela.id,
                        date=fecha,
                        type="viento_fuerte",
                        intensity=min(viento / 100, 1),
                        description="Rachas de viento fuertes detectadas",
                    )
                )

    # Guardar en BD
    for ev in eventos_creados:
        db.add(ev)

    db.commit()
    return eventos_creados
