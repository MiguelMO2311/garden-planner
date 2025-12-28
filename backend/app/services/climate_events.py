import random
from datetime import timedelta, date

# Tipos de eventos climáticos posibles
EVENT_TYPES = [
    "lluvia",
    "tormenta",
    "granizo",
    "ola_de_calor",
    "helada",
    "viento_fuerte",
]


def generar_eventos_climaticos(start_date: date, end_date: date, probabilidad: float = 0.2):
    """
    Genera una lista de eventos climáticos simulados entre dos fechas.

    Args:
        start_date (date): Fecha inicial.
        end_date (date): Fecha final.
        probabilidad (float): Probabilidad diaria de que ocurra un evento (0.0 - 1.0).

    Returns:
        List[dict]: Lista de eventos climáticos generados.
    """

    eventos = []
    current = start_date

    while current <= end_date:
        if random.random() < probabilidad:
            tipo = random.choice(EVENT_TYPES)

            evento = {
                "date": current,
                "type": tipo,
                "intensity": round(random.uniform(0.1, 1.0), 2),
                "description": generar_descripcion(tipo),
            }

            eventos.append(evento)

        current += timedelta(days=1)

    return eventos


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
