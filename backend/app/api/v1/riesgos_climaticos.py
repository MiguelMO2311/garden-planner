from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.riesgo_climatico import calcular_riesgos_climaticos
from app.schemas.riesgo_climatico_schema import RiesgoClimaticoRead

router = APIRouter(tags=["Riesgos climáticos"])


@router.post("/{cultivo_parcela_id}", response_model=List[RiesgoClimaticoRead])
def evaluar_riesgos(
    cultivo_parcela_id: int,
    temperatura: float,
    humedad: float,
    lluvia: float,
    db: Session = Depends(get_db)
):
    riesgos = calcular_riesgos_climaticos(
        db,
        cultivo_parcela_id,
        temperatura,
        humedad,
        lluvia
    )
    return riesgos
