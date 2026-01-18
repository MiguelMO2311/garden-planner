from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.tarea import Tarea
from app.models.cultivo_parcela import CultivoParcela
from app.models.plot import Plot

from app.schemas.tarea import TareaCreate, TareaUpdate, TareaRead
from app.schemas.tarea_from_recommendation import TareaFromRecommendation
from datetime import date

router = APIRouter()


# ---------------------------------------------------------
# LISTAR TAREAS (ROBUSTO PARA SQLITE)
# ---------------------------------------------------------
@router.get("/", response_model=List[TareaRead])
def list_tareas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tareas = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela, innerjoin=False),
            joinedload(Tarea.cultivo_parcela, innerjoin=False).joinedload(
                CultivoParcela.parcela, innerjoin=False
            )
        )
        .filter(Tarea.user_id == current_user.id)
        .all()
    )
    return tareas


# ---------------------------------------------------------
# OBTENER UNA TAREA (ROBUSTO)
# ---------------------------------------------------------
@router.get("/{tarea_id}", response_model=TareaRead)
def get_tarea(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela, innerjoin=False),
            joinedload(Tarea.cultivo_parcela, innerjoin=False).joinedload(
                CultivoParcela.parcela, innerjoin=False
            )
        )
        .filter(
            Tarea.id == tarea_id,
            Tarea.user_id == current_user.id
        )
        .first()
    )

    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    return tarea


# ---------------------------------------------------------
# CREAR TAREA (ROBUSTO)
# ---------------------------------------------------------
@router.post("/", response_model=TareaRead, status_code=201)
def create_tarea(
    tarea: TareaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validar cultivo_parcela
    cultivo_parcela = (
        db.query(CultivoParcela)
        .join(Plot)
        .filter(
            CultivoParcela.id == tarea.cultivo_parcela_id,
            Plot.user_id == current_user.id
        )
        .first()
    )
    if not cultivo_parcela:
        raise HTTPException(
            status_code=404,
            detail="Cultivo en parcela no encontrado o no pertenece al usuario"
        )

    # Crear tarea
    db_tarea = Tarea(
        titulo=tarea.titulo,
        descripcion=tarea.descripcion,
        fecha=tarea.fecha,
        estado=tarea.estado,
        cultivo_parcela_id=tarea.cultivo_parcela_id,
        parcela_id=tarea.parcela_id,
        user_id=current_user.id
    )

    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)

    # Recargar con relaciones completas (robusto)
    db_tarea = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela, innerjoin=False),
            joinedload(Tarea.cultivo_parcela, innerjoin=False).joinedload(
                CultivoParcela.parcela, innerjoin=False
            )
        )
        .filter(Tarea.id == db_tarea.id)
        .first()
    )

    return db_tarea


# ---------------------------------------------------------
# ACTUALIZAR TAREA (ROBUSTO)
# ---------------------------------------------------------
@router.put("/{tarea_id}", response_model=TareaRead)
def update_tarea(
    tarea_id: int,
    tarea: TareaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tarea = (
        db.query(Tarea)
        .filter(
            Tarea.id == tarea_id,
            Tarea.user_id == current_user.id
        )
        .first()
    )

    if not db_tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    update_data = tarea.dict(exclude_unset=True)

    # Validar cultivo_parcela si se cambia
    if "cultivo_parcela_id" in update_data:
        cultivo_parcela = (
            db.query(CultivoParcela)
            .join(Plot)
            .filter(
                CultivoParcela.id == update_data["cultivo_parcela_id"],
                Plot.user_id == current_user.id
            )
            .first()
        )
        if not cultivo_parcela:
            raise HTTPException(
                status_code=404,
                detail="Cultivo en parcela no encontrado o no pertenece al usuario"
            )

    for field, value in update_data.items():
        setattr(db_tarea, field, value)

    db.commit()
    db.refresh(db_tarea)

    # Recargar con relaciones completas (robusto)
    db_tarea = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela, innerjoin=False),
            joinedload(Tarea.cultivo_parcela, innerjoin=False).joinedload(
                CultivoParcela.parcela, innerjoin=False
            )
        )
        .filter(Tarea.id == db_tarea.id)
        .first()
    )

    return db_tarea


# ---------------------------------------------------------
# ELIMINAR TAREA
# ---------------------------------------------------------
@router.delete("/{tarea_id}", status_code=204)
def delete_tarea(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tarea = (
        db.query(Tarea)
        .filter(
            Tarea.id == tarea_id,
            Tarea.user_id == current_user.id
        )
        .first()
    )

    if not db_tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    db.delete(db_tarea)
    db.commit()

    return None


# ---------------------------------------------------------
#  TAREA DESDE RECOMENDACION (ROBUSTO)
# ---------------------------------------------------------
@router.post("/from-recommendation", response_model=TareaRead, status_code=201)
def create_tarea_from_recommendation(
    data: TareaFromRecommendation,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1) Verificar que la parcela pertenece al usuario
    parcela = (
        db.query(Plot)
        .filter(
            Plot.id == data.plot_id,
            Plot.user_id == current_user.id
        )
        .first()
    )
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no encontrada o no pertenece al usuario")

    # 2) Obtener cultivo activo
    cultivo_activo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.parcela_id == data.plot_id,
            CultivoParcela.estado == "activo",
            CultivoParcela.fecha_cosecha.is_(None)
        )
        .first()
    )

    if not cultivo_activo:
        raise HTTPException(status_code=400, detail="No hay cultivo activo en esta parcela")

    # 3) Crear título legible
    titulo = data.recommendation_type.replace("_", " ").capitalize()

    # 4) Fecha sugerida
    fecha_tarea = data.date or date.today()

    # 5) Crear tarea
    db_tarea = Tarea(
        titulo=titulo,
        descripcion=data.message,
        fecha=fecha_tarea,
        estado="pendiente",
        cultivo_parcela_id=cultivo_activo.id,
        parcela_id=data.plot_id,
        user_id=current_user.id
    )

    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)

    # 6) Recargar con relaciones completas (robusto)
    db_tarea = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela, innerjoin=False),
            joinedload(Tarea.cultivo_parcela, innerjoin=False).joinedload(
                CultivoParcela.parcela, innerjoin=False
            )
        )
        .filter(Tarea.id == db_tarea.id)
        .first()
    )

    return db_tarea
