# app/api/v1/recomendaciones.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.recomendacion import Recomendacion
from app.models.tratamiento import Tratamiento
from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.cultivo_parcela import CultivoParcela
from app.models.tarea import Tarea
from app.models.user import User

from app.schemas.recomendacion_schema import (
    RecomendacionCreate,
    RecomendacionUpdate,
    RecomendacionRead
)

router = APIRouter(tags=["Recomendaciones"])


# ---------------------------------------------------------
# CREAR RECOMENDACIÓN
# ---------------------------------------------------------
@router.post("/", response_model=RecomendacionRead)
def create_recomendacion(
    data: RecomendacionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = db.query(CultivoParcela).filter(
        CultivoParcela.id == data.cultivo_parcela_id
    ).first()

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado")

    rec = Recomendacion(
        cultivo_parcela_id=cultivo.id,
        user_id=user.id,
        mensaje=data.mensaje,
        fecha_sugerida=data.fecha_sugerida,
        estado="pendiente"
    )

    db.add(rec)
    db.commit()
    db.refresh(rec)

    return rec


# ---------------------------------------------------------
# LISTAR RECOMENDACIONES DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[RecomendacionRead])
def list_recomendaciones(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(Recomendacion)
        .filter(Recomendacion.user_id == user.id)
        .order_by(Recomendacion.fecha_sugerida)
        .all()
    )


# ---------------------------------------------------------
# OBTENER RECOMENDACIÓN POR ID
# ---------------------------------------------------------
@router.get("/{rec_id}", response_model=RecomendacionRead)
def get_recomendacion(
    rec_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rec = db.query(Recomendacion).filter(
        Recomendacion.id == rec_id,
        Recomendacion.user_id == user.id
    ).first()

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada")

    return rec


# ---------------------------------------------------------
# DESCARTAR RECOMENDACIÓN
# ---------------------------------------------------------
@router.post("/{rec_id}/descartar")
def descartar_recomendacion(
    rec_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rec = db.query(Recomendacion).filter(
        Recomendacion.id == rec_id,
        Recomendacion.user_id == user.id
    ).first()

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada")

    rec.estado = "descartada"
    db.commit()

    return {"message": "Recomendación descartada"}


# ---------------------------------------------------------
# MARCAR COMO REALIZADA
# ---------------------------------------------------------
@router.post("/{rec_id}/realizada")
def realizar_recomendacion(
    rec_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rec = db.query(Recomendacion).filter(
        Recomendacion.id == rec_id,
        Recomendacion.user_id == user.id
    ).first()

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada")

    rec.estado = "realizada"
    db.commit()

    return {"message": "Recomendación marcada como realizada"}


# ---------------------------------------------------------
# ACTIVAR RECOMENDACIÓN → APLICAR TRATAMIENTO
# ---------------------------------------------------------
@router.post("/{rec_id}/activar", response_model=RecomendacionRead)
def activar_recomendacion(
    rec_id: int,
    tratamiento_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rec = db.query(Recomendacion).filter(
        Recomendacion.id == rec_id,
        Recomendacion.user_id == user.id
    ).first()

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada")

    tratamiento = db.query(Tratamiento).filter(
        Tratamiento.id == tratamiento_id
    ).first()

    if not tratamiento:
        raise HTTPException(404, "Tratamiento no encontrado")

    cultivo = db.query(CultivoParcela).filter(
        CultivoParcela.id == rec.cultivo_parcela_id
    ).first()

    # Crear tratamiento aplicado
    aplicado = TratamientoAplicado(
        tratamiento_id=tratamiento.id,
        cultivo_parcela_id=cultivo.id,
        user_id=user.id,
        fecha_inicio=date.today(),
        fecha_fin_prevista=(
            date.today() + timedelta(days=tratamiento.duracion_dias)
            if tratamiento.duracion_dias else None
        ),
        estado="en_progreso",
        observaciones=f"Tratamiento generado desde recomendación #{rec.id}"
    )

    db.add(aplicado)
    db.commit()
    db.refresh(aplicado)

    # Crear tarea sanitaria
    tarea = Tarea(
        titulo=f"Aplicar tratamiento: {tratamiento.nombre}",
        descripcion=tratamiento.descripcion,
        fecha=date.today(),
        fecha_fin=aplicado.fecha_fin_prevista,
        estado="pendiente",
        origen="sanitario",
        cultivo_parcela_id=cultivo.id,
        parcela_id=cultivo.parcela_id,
        user_id=user.id,
        tratamiento_id=aplicado.id
    )

    db.add(tarea)

    # Marcar recomendación como realizada
    rec.estado = "realizada"

    db.commit()

    return rec
