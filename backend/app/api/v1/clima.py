from fastapi import APIRouter
from datetime import date, timedelta

from app.services.climate_events import generar_eventos_climaticos

router = APIRouter()

@router.post("/clima/actualizar")
def actualizar_clima():
    # Por ejemplo: generar eventos para los próximos 7 días
    start = date.today()
    end = start + timedelta(days=7)

    eventos = generar_eventos_climaticos(start, end)

    return {
        "status": "ok",
        "eventos_generados": eventos
    }
