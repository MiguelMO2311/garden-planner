from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.alertas_sanitarias import generar_alertas_desde_riesgos
from app.schemas.alerta_sanitaria_schema import AlertaSanitariaRead

router = APIRouter(tags=["Alertas sanitarias"])


@router.post("/{cultivo_parcela_id}", response_model=List[AlertaSanitariaRead])
def generar_alertas(cultivo_parcela_id: int, db: Session = Depends(get_db)):
    alertas = generar_alertas_desde_riesgos(db, cultivo_parcela_id)
    return alertas
