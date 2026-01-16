from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.models.evento_sanitario import EventoSanitario
from app.models.cultivo_parcela import CultivoParcela
from app.models.tratamiento import Tratamiento

from app.schemas.evento_sanitario_schema import (
    EventoSanitarioCreate,
    EventoSanitarioRead
)

router = APIRouter(tags=["Eventos sanitarios"])


# ---------------------------------------------------------
# Crear evento sanitario (aplicar tratamiento)
# ---------------------------------------------------------
@router.post("/", response_model=EventoSanitarioRead)
def create_evento_sanitario(
    evento_in: EventoSanitarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar que el cultivo_parcela pertenece al usuario
    cultivo_parcela = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.id == evento_in.cultivo_parcela_id,
            CultivoParcela.user_id == current_user.id
        )
        .first()
    )

    if not cultivo_parcela:
        raise HTTPException(status_code=404, detail="Cultivo en parcela no encontrado")

    # Verificar que el tratamiento existe
    tratamiento = db.query(Tratamiento).filter(Tratamiento.id == evento_in.tratamiento_id).first()
    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")

    evento = EventoSanitario(**evento_in.model_dump())
    db.add(evento)
    db.commit()
    db.refresh(evento)

    return evento


# ---------------------------------------------------------
# Listar eventos sanitarios del usuario
# ---------------------------------------------------------
@router.get("/", response_model=List[EventoSanitarioRead])
def list_eventos_sanitarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    eventos = (
        db.query(EventoSanitario)
        .join(CultivoParcela)
        .filter(CultivoParcela.user_id == current_user.id)
        .order_by(EventoSanitario.fecha.desc())
        .all()
    )

    return eventos
