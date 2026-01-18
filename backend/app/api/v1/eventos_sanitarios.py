from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.evento_sanitario import EventoSanitario
from app.models.cultivo_parcela import CultivoParcela
from app.models.recomendacion import Recomendacion
from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.user import User

from app.schemas.evento_sanitario_schema import (
    EventoSanitarioCreate,
    EventoSanitarioRead
)

router = APIRouter(
    prefix="/eventos_sanitarios",
    tags=["Eventos sanitarios"]
)

# ---------------------------------------------------------
# CREAR EVENTO SANITARIO
# ---------------------------------------------------------
@router.post("/", response_model=EventoSanitarioRead)
def create_evento_sanitario(
    data: EventoSanitarioCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.id == data.cultivo_parcela_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado o no pertenece al usuario")

    evento = EventoSanitario(
        cultivo_parcela_id=cultivo.id,
        fecha=data.fecha or date.today(),
        riesgo=data.riesgo,
        probabilidad=data.probabilidad,
        objetivo=data.objetivo,
        notas=data.notas,
        estado="activa"
    )

    db.add(evento)
    db.commit()
    db.refresh(evento)

    # Crear recomendación automática
    recomendacion = Recomendacion(
        cultivo_parcela_id=cultivo.id,
        mensaje=f"Revisar posible aparición de {evento.riesgo}",
        fecha_sugerida=date.today(),
        estado="pendiente"
    )

    db.add(recomendacion)
    db.commit()

    return evento

# ---------------------------------------------------------
# LISTAR EVENTOS SANITARIOS DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[EventoSanitarioRead])
def list_eventos_sanitarios(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(EventoSanitario)
        .join(CultivoParcela, CultivoParcela.id == EventoSanitario.cultivo_parcela_id)
        .filter(CultivoParcela.user_id == user.id)
        .order_by(EventoSanitario.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# OBTENER EVENTO SANITARIO POR ID
# ---------------------------------------------------------
@router.get("/{evento_id}", response_model=EventoSanitarioRead)
def get_evento_sanitario(
    evento_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    evento = (
        db.query(EventoSanitario)
        .join(CultivoParcela, CultivoParcela.id == EventoSanitario.cultivo_parcela_id)
        .filter(
            EventoSanitario.id == evento_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not evento:
        raise HTTPException(404, "Evento sanitario no encontrado o no pertenece al usuario")

    return evento

# ---------------------------------------------------------
# RESOLVER EVENTO SANITARIO
# ---------------------------------------------------------
@router.post("/{evento_id}/resolver")
def resolver_evento_sanitario(
    evento_id: int,
    tratamiento_aplicado_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    evento = (
        db.query(EventoSanitario)
        .join(CultivoParcela, CultivoParcela.id == EventoSanitario.cultivo_parcela_id)
        .filter(
            EventoSanitario.id == evento_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not evento:
        raise HTTPException(404, "Evento sanitario no encontrado o no pertenece al usuario")

    evento.estado = "resuelta"

    # Vincular tratamiento aplicado si se pasa
    if tratamiento_aplicado_id:
        tratamiento = (
            db.query(TratamientoAplicado)
            .join(CultivoParcela, CultivoParcela.id == TratamientoAplicado.cultivo_parcela_id)
            .filter(
                TratamientoAplicado.id == tratamiento_aplicado_id,
                CultivoParcela.user_id == user.id
            )
            .first()
        )

        if tratamiento:
            evento.tratamiento_id = tratamiento.id

    db.commit()

    return {"message": "Evento sanitario resuelto correctamente"}
