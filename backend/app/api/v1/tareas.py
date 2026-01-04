from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.tarea import Tarea
from app.schemas.tarea import TareaCreate, TareaUpdate, TareaRead

router = APIRouter()


# -------------------------
# LISTAR TAREAS DEL USUARIO
# -------------------------
@router.get("/", response_model=List[TareaRead])
def list_tareas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela),
            joinedload(Tarea.cultivo)
        )
        .filter(Tarea.user_id == current_user.id)
        .all()
    )


# -------------------------
# OBTENER UNA TAREA DEL USUARIO
# -------------------------
@router.get("/{tarea_id}", response_model=TareaRead)
def get_tarea(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = (
        db.query(Tarea)
        .options(
            joinedload(Tarea.parcela),
            joinedload(Tarea.cultivo)
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


# -------------------------
# CREAR UNA TAREA
# -------------------------
@router.post("/", response_model=TareaRead, status_code=201)
def create_tarea(
    tarea: TareaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_tarea = Tarea(
        titulo=tarea.titulo,
        descripcion=tarea.descripcion,
        fecha=tarea.fecha,
        estado=tarea.estado,
        cultivo_id=tarea.cultivo_id,
        parcela_id=tarea.parcela_id,
        user_id=current_user.id
    )

    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)

    return db_tarea


# -------------------------
# ACTUALIZAR UNA TAREA
# -------------------------
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
    for field, value in update_data.items():
        setattr(db_tarea, field, value)

    db.commit()
    db.refresh(db_tarea)

    return db_tarea


# -------------------------
# ELIMINAR UNA TAREA
# -------------------------
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

    return
