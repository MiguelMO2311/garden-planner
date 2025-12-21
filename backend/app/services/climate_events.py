from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.services.weather import get_weather_forecast
from app.crud.eventos import create_evento
from app.schemas.evento import EventoCreate
from app.core.config import settings


def generar_eventos_climaticos(db: Session):
    data = get_weather_forecast(settings.LATITUD, settings.LONGITUD)

    # Tomamos el pronóstico de mañana
    mañana = (datetime.utcnow() + timedelta(days=1)).date()

    # Filtrar pronósticos del día siguiente
    pronosticos = [
        p for p in data["list"]
        if datetime.fromtimestamp(p["dt"]).date() == mañana
    ]

    if not pronosticos:
        return

    # Analizar condiciones
    lluvia = any("rain" in p["weather"][0]["main"].lower() for p in pronosticos)
    helada = any(p["main"]["temp_min"] < 2 for p in pronosticos)
    calor = any(p["main"]["temp_max"] > 32 for p in pronosticos)
    viento = any(p["wind"]["speed"] > 40 for p in pronosticos)

    # Crear eventos según condiciones
    if lluvia:
        create_evento(db, EventoCreate(
            titulo="Lluvia prevista mañana",
            fecha=mañana,
            tipo="riego",
            descripcion="Se recomienda reducir o cancelar el riego."
        ))

    if helada:
        create_evento(db, EventoCreate(
            titulo="Posible helada",
            fecha=mañana,
            tipo="plaga",
            descripcion="Proteger cultivos sensibles."
        ))

    if calor:
        create_evento(db, EventoCreate(
            titulo="Ola de calor",
            fecha=mañana,
            tipo="riego",
            descripcion="Aumentar riego en cultivos sensibles."
        ))

    if viento:
        create_evento(db, EventoCreate(
            titulo="Viento fuerte",
            fecha=mañana,
            tipo="plaga",
            descripcion="Evitar tratamientos químicos."
        ))
