# backend/app/crud/tareas.py

from sqlalchemy.orm import Session

from backend.app.models.cultivo_tipo import TareaAgricola
from backend.app.schemas.cultivo_tipo import TareaCreate, TareaUpdate

from app.crud.eventos import create_evento, update_evento, delete_evento
from app.schemas.evento import EventoCreate, EventoUpdate
from app.models.evento import EventoAgricola


# -------------------------
# CREAR TAREA (multiusuario)
# -------------------------
def create_tarea(db: Session, data: TareaCreate, user_id: int):
    tarea = TareaAgricola(
        **data.dict(),
        user_id=user_id
    )

    db.add(tarea)
    db.commit()
    db.refresh(tarea)

    # Crear evento asociado
    create_evento(
        db,
        EventoCreate(
            titulo=f"Tarea: {tarea.titulo}",
            fecha=tarea.fecha,
            tipo="tarea",
            descripcion=tarea.descripcion,
            tarea_id=tarea.id,
            color="#2563eb"
        ),
        user_id=user_id
    )

    return tarea


# -------------------------
# ACTUALIZAR TAREA (solo del usuario)
# -------------------------
def update_tarea(db: Session, tarea_id: int, data: TareaUpdate, user_id: int):
    tarea = (
        db.query(TareaAgricola)
        .filter(
            TareaAgricola.id == tarea_id,
            TareaAgricola.user_id == user_id
        )
        .first()
    )

    if not tarea:
        return None

    for key, value in data.dict(exclude_unset=True).items():
        setattr(tarea, key, value)

    db.commit()
    db.refresh(tarea)

    # Actualizar evento asociado
    evento = (
        db.query(EventoAgricola)
        .filter(
            EventoAgricola.tarea_id == tarea.id,
            EventoAgricola.user_id == user_id
        )
        .first()
    )

    if evento:
        update_evento(
            db,
            evento.id,
            EventoUpdate(
                titulo=f"Tarea: {tarea.titulo}",
                fecha=tarea.fecha,
                descripcion=tarea.descripcion,
                color="#2563eb"
            ),
            user_id=user_id
        )

    return tarea


# -------------------------
# ELIMINAR TAREA (solo del usuario)
# -------------------------
def delete_tarea(db: Session, tarea_id: int, user_id: int):
    tarea = (
        db.query(TareaAgricola)
        .filter(
            TareaAgricola.id == tarea_id,
            TareaAgricola.user_id == user_id
        )
        .first()
    )

    if not tarea:
        return None

    # Borrar evento asociado
    delete_evento(
        db,
        db.query(EventoAgricola)
        .filter(
            EventoAgricola.tarea_id == tarea.id,
            EventoAgricola.user_id == user_id
        )
        .first()
        .id,
        user_id=user_id
    )

    db.delete(tarea)
    db.commit()

    return tarea
