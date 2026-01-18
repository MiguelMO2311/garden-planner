from fastapi import APIRouter, Depends, HTTPException, Query
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

router = APIRouter(
    prefix="",
    tags=["Recomendaciones"]
)

# ---------------------------------------------------------
# RECOMENDACIONES POR CULTIVO  ← PRIMERO (evita int_parsing)
# ---------------------------------------------------------
@router.get("/por_cultivo", response_model=list[RecomendacionRead])
def recomendaciones_por_cultivo(
    cultivo_parcela_id: int = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.id == cultivo_parcela_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado o no pertenece al usuario")

    recomendaciones = (
        db.query(Recomendacion)
        .filter(Recomendacion.cultivo_parcela_id == cultivo.id)
        .order_by(Recomendacion.fecha_sugerida)
        .all()
    )

    return recomendaciones

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
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(CultivoParcela.user_id == user.id)
        .order_by(Recomendacion.fecha_sugerida)
        .all()
    )

# ---------------------------------------------------------
# CREAR RECOMENDACIÓN
# ---------------------------------------------------------
@router.post("/", response_model=RecomendacionRead)
def create_recomendacion(
    data: RecomendacionCreate,
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

    rec = Recomendacion(
        cultivo_parcela_id=cultivo.id,
        mensaje=data.mensaje,
        fecha_sugerida=data.fecha_sugerida,
        estado="pendiente"
    )

    db.add(rec)
    db.commit()
    db.refresh(rec)

    return rec

# ---------------------------------------------------------
# OBTENER RECOMENDACIÓN POR ID  ← DESPUÉS DE /por_cultivo
# ---------------------------------------------------------
@router.get("/{rec_id}", response_model=RecomendacionRead)
def get_recomendacion(
    rec_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rec = (
        db.query(Recomendacion)
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(
            Recomendacion.id == rec_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada o no pertenece al usuario")

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
    rec = (
        db.query(Recomendacion)
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(
            Recomendacion.id == rec_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada o no pertenece al usuario")

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
    rec = (
        db.query(Recomendacion)
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(
            Recomendacion.id == rec_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada o no pertenece al usuario")

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
    rec = (
        db.query(Recomendacion)
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(
            Recomendacion.id == rec_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not rec:
        raise HTTPException(404, "Recomendación no encontrada o no pertenece al usuario")

    tratamiento = db.query(Tratamiento).filter(
        Tratamiento.id == tratamiento_id
    ).first()

    if not tratamiento:
        raise HTTPException(404, "Tratamiento no encontrado")

    cultivo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.id == rec.cultivo_parcela_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    aplicado = TratamientoAplicado(
        tratamiento_id=tratamiento.id,
        cultivo_parcela_id=cultivo.id,
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

    rec.estado = "realizada"
    db.commit()

    return rec

# ---------------------------------------------------------
# RECOMENDACIONES POR PARCELA
# ---------------------------------------------------------
@router.get("/parcelas/{plot_id}", response_model=list[RecomendacionRead])
def recomendaciones_por_parcela(
    plot_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    from app.models.plot import Plot

    parcela = (
        db.query(Plot)
        .filter(Plot.id == plot_id, Plot.user_id == user.id)
        .first()
    )

    if not parcela:
        raise HTTPException(404, "Parcela no encontrada o no pertenece al usuario")

    cultivo_activo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.parcela_id == plot_id,
            CultivoParcela.estado == "activo",
            CultivoParcela.fecha_cosecha.is_(None)
        )
        .first()
    )

    if not cultivo_activo:
        return []

    recomendaciones = (
        db.query(Recomendacion)
        .join(CultivoParcela, CultivoParcela.id == Recomendacion.cultivo_parcela_id)
        .filter(
            Recomendacion.cultivo_parcela_id == cultivo_activo.id,
            CultivoParcela.user_id == user.id
        )
        .order_by(Recomendacion.fecha_sugerida)
        .all()
    )

    return recomendaciones
