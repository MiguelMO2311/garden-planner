from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.sugerencias_sanitarias import generar_sugerencias
from app.schemas.sugerencia_sanitaria_schema import SugerenciaSanitariaRead
from app.crud.sugerencias_sanitarias import sugerencias_sanitarias_crud

router = APIRouter(tags=["Sugerencias sanitarias"])


@router.post("/{cultivo_parcela_id}", response_model=List[SugerenciaSanitariaRead])
def sugerencias(cultivo_parcela_id: int, db: Session = Depends(get_db)):
    return sugerencias_sanitarias_crud.generar_para_cultivo_parcela(db, cultivo_parcela_id)

