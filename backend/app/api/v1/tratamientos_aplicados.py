from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.tratamiento import Tratamiento
from app.models.cultivo_parcela import CultivoParcela
from app.models.tarea import Tarea
from app.models.user import User

from app.schemas.tratamiento_aplicado_schema import (
    TratamientoAplicadoCreate,
    TratamientoAplicadoRead
)

router = APIRouter(
    prefix="/tratamientos_aplicados",
    tags=["Tratamientos aplicados"]
)

# ---------------------------------------------------------
# APLICAR TRATAMIENTO A UN CULTIVO EN PARCELA
# ---------------------------------------------------------
@router.post("/", response_model=TratamientoAplicadoRead)
def aplicar_tratamiento(
    data: TratamientoAplicadoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # 1) Validar cultivo en parcela y que pertenece al usuario
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

    # 2) Validar tratamiento base
    tratamiento = db.query(Tratamiento).filter(
        Tratamiento.id == data.tratamiento_id
    ).first()

    if not tratamiento:
        raise HTTPException(404, "Tratamiento no encontrado")

    # 3) Fecha de inicio
    fecha_inicio = data.fecha_inicio or date.today()

    # 4) Calcular fecha fin prevista
    fecha_fin_prevista = (
        fecha_inicio + timedelta(days=tratamiento.duracion_dias)
        if tratamiento.duracion_dias else None
    )

    # 5) Crear tratamiento aplicado (sin user_id)
    aplicado = TratamientoAplicado(
        tratamiento_id=tratamiento.id,
        cultivo_parcela_id=cultivo.id,
        fecha_inicio=fecha_inicio,
        fecha_fin_prevista=fecha_fin_prevista,
        estado="en_progreso",
        observaciones=data.observaciones
    )

    db.add(aplicado)
    db.commit()
    db.refresh(aplicado)

    # 6) Crear tarea sanitaria automática
    tarea = Tarea(
        titulo=f"Aplicar tratamiento: {tratamiento.nombre}",
        descripcion=tratamiento.descripcion or "Tratamiento sanitario",
        fecha=fecha_inicio,
        fecha_fin=fecha_fin_prevista,
        estado="pendiente",
        origen="sanitario",
        cultivo_parcela_id=cultivo.id,
        parcela_id=cultivo.parcela_id,
        user_id=user.id,
        tratamiento_id=aplicado.id
    )

    db.add(tarea)
    db.commit()

    return aplicado


# ---------------------------------------------------------
# FINALIZAR TRATAMIENTO
# ---------------------------------------------------------
@router.post("/{tratamiento_id}/finalizar")
def finalizar_tratamiento(
    tratamiento_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Validar que el tratamiento pertenece a una parcela del usuario
    tratamiento = (
        db.query(TratamientoAplicado)
        .join(CultivoParcela, CultivoParcela.id == TratamientoAplicado.cultivo_parcela_id)
        .filter(
            TratamientoAplicado.id == tratamiento_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not tratamiento:
        raise HTTPException(404, "Tratamiento no encontrado o no pertenece al usuario")

    tratamiento.estado = "finalizado"
    tratamiento.fecha_fin = date.today()

    # Cerrar tarea asociada
    tarea = db.query(Tarea).filter(
        Tarea.tratamiento_id == tratamiento.id
    ).first()

    if tarea:
        tarea.estado = "completada"
        tarea.fecha_fin = date.today()

    db.commit()

    return {"message": "Tratamiento finalizado correctamente"}


# ---------------------------------------------------------
# LISTAR TRATAMIENTOS APLICADOS DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[TratamientoAplicadoRead])
def list_tratamientos_aplicados(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(TratamientoAplicado)
        .join(CultivoParcela, CultivoParcela.id == TratamientoAplicado.cultivo_parcela_id)
        .filter(CultivoParcela.user_id == user.id)
        .order_by(TratamientoAplicado.fecha_inicio.desc())
        .all()
    )


# ---------------------------------------------------------
# OBTENER TRATAMIENTO APLICADO POR ID
# ---------------------------------------------------------
@router.get("/{tratamiento_id}", response_model=TratamientoAplicadoRead)
def get_tratamiento_aplicado(
    tratamiento_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    tratamiento = (
        db.query(TratamientoAplicado)
        .join(CultivoParcela, CultivoParcela.id == TratamientoAplicado.cultivo_parcela_id)
        .filter(
            TratamientoAplicado.id == tratamiento_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not tratamiento:
        raise HTTPException(404, "Tratamiento no encontrado o no pertenece al usuario")

    return tratamiento
