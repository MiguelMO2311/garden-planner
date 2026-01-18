from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.alerta_sanitaria import AlertaSanitaria
from app.models.evento_sanitario import EventoSanitario
from app.models.recomendacion import Recomendacion
from app.models.cultivo_parcela import CultivoParcela
from app.models.user import User

from app.schemas.alerta_sanitaria_schema import (
    AlertaSanitariaCreate,
    AlertaSanitariaRead
)

router = APIRouter(
    prefix="/alertas_sanitarias",
    tags=["Alertas sanitarias"]
)

# ---------------------------------------------------------
# LISTAR ALERTAS POR CULTIVO  ← PRIMERO (evita int_parsing)
# ---------------------------------------------------------
@router.get("/por_cultivo", response_model=list[AlertaSanitariaRead])
def list_alertas_por_cultivo(
    cultivo_parcela_id: int = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(AlertaSanitaria)
        .join(CultivoParcela, CultivoParcela.id == AlertaSanitaria.cultivo_parcela_id)
        .filter(
            CultivoParcela.user_id == user.id,
            AlertaSanitaria.cultivo_parcela_id == cultivo_parcela_id
        )
        .order_by(AlertaSanitaria.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# LISTAR ALERTAS DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[AlertaSanitariaRead])
def list_alertas(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(AlertaSanitaria)
        .join(CultivoParcela, CultivoParcela.id == AlertaSanitaria.cultivo_parcela_id)
        .filter(CultivoParcela.user_id == user.id)
        .order_by(AlertaSanitaria.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# CREAR ALERTA SANITARIA
# ---------------------------------------------------------
@router.post("/", response_model=AlertaSanitariaRead)
def create_alerta_sanitaria(
    data: AlertaSanitariaCreate,
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

    alerta = AlertaSanitaria(
        cultivo_parcela_id=cultivo.id,
        fecha=data.fecha or date.today(),
        riesgo=data.riesgo,
        probabilidad=data.probabilidad,
        prioridad=data.prioridad,
        mensaje=data.mensaje,
        estado="pendiente"
    )

    db.add(alerta)
    db.commit()
    db.refresh(alerta)

    return alerta

# ---------------------------------------------------------
# OBTENER ALERTA POR ID  ← DESPUÉS DE /por_cultivo
# ---------------------------------------------------------
@router.get("/{alerta_id}", response_model=AlertaSanitariaRead)
def get_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    alerta = (
        db.query(AlertaSanitaria)
        .join(CultivoParcela, CultivoParcela.id == AlertaSanitaria.cultivo_parcela_id)
        .filter(
            AlertaSanitaria.id == alerta_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada o no pertenece al usuario")

    return alerta

# ---------------------------------------------------------
# CONFIRMAR ALERTA → CREAR EVENTO SANITARIO
# ---------------------------------------------------------
@router.post("/{alerta_id}/confirmar")
def confirmar_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    alerta = (
        db.query(AlertaSanitaria)
        .join(CultivoParcela, CultivoParcela.id == AlertaSanitaria.cultivo_parcela_id)
        .filter(
            AlertaSanitaria.id == alerta_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada o no pertenece al usuario")

    alerta.estado = "confirmada"

    evento = EventoSanitario(
        cultivo_parcela_id=alerta.cultivo_parcela_id,
        fecha=date.today(),
        riesgo=alerta.riesgo,
        probabilidad=alerta.probabilidad,
        objetivo=f"Control de {alerta.riesgo}",
        notas=f"Evento generado desde alerta #{alerta.id}",
        estado="activa"
    )

    db.add(evento)
    db.commit()
    db.refresh(evento)

    recomendacion = Recomendacion(
        cultivo_parcela_id=alerta.cultivo_parcela_id,
        mensaje=f"Revisar cultivo por posible aparición de {alerta.riesgo}",
        fecha_sugerida=date.today(),
        estado="pendiente"
    )

    db.add(recomendacion)
    db.commit()

    return {"message": "Alerta confirmada y evento sanitario creado", "evento_id": evento.id}

# ---------------------------------------------------------
# DESCARTAR ALERTA
# ---------------------------------------------------------
@router.post("/{alerta_id}/descartar")
def descartar_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    alerta = (
        db.query(AlertaSanitaria)
        .join(CultivoParcela, CultivoParcela.id == AlertaSanitaria.cultivo_parcela_id)
        .filter(
            AlertaSanitaria.id == alerta_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada o no pertenece al usuario")

    alerta.estado = "descartada"
    db.commit()

    return {"message": "Alerta descartada correctamente"}
