from pydantic import BaseModel
from datetime import date

class EventoBase(BaseModel):
    titulo: str
    fecha: date
    tipo: str = "tarea"
    descripcion: str | None = None
    tarea_id: int | None = None
    color: str | None = "#2563eb"

class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    titulo: str | None = None
    fecha: date | None = None
    descripcion: str | None = None
    color: str | None = None        # NUEVO
