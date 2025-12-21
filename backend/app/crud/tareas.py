# backend/app/crud/tareas.py

from sqlalchemy.orm import Session

from app.models.crop import TareaAgricola
from app.schemas.crop import TareaCreate, TareaUpdate

from app.crud.eventos import create_evento, update_evento, delete_evento
from app.schemas.evento import EventoCreate, EventoUpdate
from app.models.evento import EventoAgricola



def create_tarea(db: Session, data: TareaCreate):
    tarea = TareaAgricola(**data.dict())
    db.add(tarea)
    db.commit()
    db.refresh(tarea)

    create_evento(db, EventoCreate(
    titulo=f"Tarea: {tarea.titulo}",
    fecha=tarea.fecha,
    tipo="tarea",
    descripcion=tarea.descripcion,
    tarea_id=tarea.id,
    color="#2563eb"  # azul intenso para tareas
))


    return tarea


def update_tarea(db: Session, tarea_id: int, data: TareaUpdate):
    tarea = db.query(TareaAgricola).filter(TareaAgricola.id == tarea_id).first()

    for key, value in data.dict(exclude_unset=True).items():
        setattr(tarea, key, value)

    db.commit()
    db.refresh(tarea)

    # Actualizar evento asociado
    evento = db.query(EventoAgricola).filter(EventoAgricola.tarea_id == tarea.id).first()
    if evento:
        update_evento(db, evento.id, EventoUpdate(
            titulo=f"Tarea: {tarea.titulo}",
            fecha=tarea.fecha,
            descripcion=tarea.descripcion,
            color="#2563eb"
))

    return tarea


def delete_tarea(db: Session, tarea_id: int):
    # Eliminar evento asociado
    evento = db.query(EventoAgricola).filter(EventoAgricola.tarea_id == tarea_id).first()
    if evento:
        delete_evento(db, evento.id)

    tarea = db.query(TareaAgricola).filter(TareaAgricola.id == tarea_id).first()
    if tarea:
        db.delete(tarea)
        db.commit()
