from sqlalchemy.orm import Session
from app.models.evento import EventoAgricola
from app.schemas.evento import EventoCreate, EventoUpdate


def color_por_tipo(tipo: str) -> str:
    colores = {
        "tarea": "#2563eb",    # azul
        "riego": "#16a34a",    # verde
        "plaga": "#dc2626",    # rojo
        "siembra": "#ca8a04",  # amarillo
        "cosecha": "#ea580c",  # naranja
    }
    return colores.get(tipo, "#2563eb")


# -------------------------
# CREAR EVENTO (multiusuario)
# -------------------------
def create_evento(db: Session, data: EventoCreate, user_id: int):
    data.color = color_por_tipo(data.tipo)

    evento = EventoAgricola(
        **data.dict(),
        user_id=user_id
    )

    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento


# -------------------------
# ACTUALIZAR EVENTO (solo del usuario)
# -------------------------
def update_evento(db: Session, evento_id: int, data: EventoUpdate, user_id: int):
    evento = (
        db.query(EventoAgricola)
        .filter(
            EventoAgricola.id == evento_id,
            EventoAgricola.user_id == user_id
        )
        .first()
    )

    if not evento:
        return None

    if data.tipo:
        data.color = color_por_tipo(data.tipo)

    for key, value in data.dict(exclude_unset=True).items():
        setattr(evento, key, value)

    db.commit()
    db.refresh(evento)
    return evento


# -------------------------
# ELIMINAR EVENTO (solo del usuario)
# -------------------------
def delete_evento(db: Session, evento_id: int, user_id: int):
    evento = (
        db.query(EventoAgricola)
        .filter(
            EventoAgricola.id == evento_id,
            EventoAgricola.user_id == user_id
        )
        .first()
    )

    if evento:
        db.delete(evento)
        db.commit()
