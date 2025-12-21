from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.climate_events import generar_eventos_climaticos

router = APIRouter()

@router.post("/clima/actualizar")
def actualizar_clima(db: Session = Depends(get_db)):
    generar_eventos_climaticos(db)
    return {"status": "ok"}
