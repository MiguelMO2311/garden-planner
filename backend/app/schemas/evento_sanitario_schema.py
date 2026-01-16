from pydantic import BaseModel
from datetime import date

class EventoSanitarioBase(BaseModel):
    cultivo_parcela_id: int
    tratamiento_id: int
    fecha: date
    dosis: str | None = None
    notas: str | None = None
    objetivo: str | None = None

class EventoSanitarioCreate(EventoSanitarioBase):
    pass

class EventoSanitarioRead(EventoSanitarioBase):
    id: int

    class Config:
        from_attributes = True
