# app/api/v1/alertas_sanitarias.py

from fastapi import APIRouter, Depends, HTTPException
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

router = APIRouter(tags=["Alertas sanitarias"])


# ---------------------------------------------------------
# CREAR ALERTA SANITARIA (desde riesgo o manual)
# ---------------------------------------------------------
@router.post("/", response_model=AlertaSanitariaRead)
def create_alerta_sanitaria(
    data: AlertaSanitariaCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = db.query(CultivoParcela).filter(
        CultivoParcela.id == data.cultivo_parcela_id
    ).first()

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado")

    alerta = AlertaSanitaria(
        cultivo_parcela_id=cultivo.id,
        user_id=user.id,
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
# LISTAR ALERTAS DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[AlertaSanitariaRead])
def list_alertas(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(AlertaSanitaria)
        .filter(AlertaSanitaria.user_id == user.id)
        .order_by(AlertaSanitaria.fecha.desc())
        .all()
    )


# ---------------------------------------------------------
# OBTENER ALERTA POR ID
# ---------------------------------------------------------
@router.get("/{alerta_id}", response_model=AlertaSanitariaRead)
def get_alerta(
    alerta_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    alerta = db.query(AlertaSanitaria).filter(
        AlertaSanitaria.id == alerta_id,
        AlertaSanitaria.user_id == user.id
    ).first()

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada")

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
    alerta = db.query(AlertaSanitaria).filter(
        AlertaSanitaria.id == alerta_id,
        AlertaSanitaria.user_id == user.id
    ).first()

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada")

    alerta.estado = "confirmada"

    # Crear evento sanitario asociado
    evento = EventoSanitario(
        cultivo_parcela_id=alerta.cultivo_parcela_id,
        user_id=user.id,
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

    # Crear recomendación automática
    recomendacion = Recomendacion(
        cultivo_parcela_id=alerta.cultivo_parcela_id,
        user_id=user.id,
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
    alerta = db.query(AlertaSanitaria).filter(
        AlertaSanitaria.id == alerta_id,
        AlertaSanitaria.user_id == user.id
    ).first()

    if not alerta:
        raise HTTPException(404, "Alerta sanitaria no encontrada")

    alerta.estado = "descartada"
    db.commit()

    return {"message": "Alerta descartada correctamente"}
