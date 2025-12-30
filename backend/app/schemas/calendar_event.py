import datetime
from pydantic import BaseModel


# -----------------------------
# Evento combinado (para el GET del calendario)
# Este es el que usas para devolver TODOS los eventos
# (planes, riegos, plagas, manuales, etc.)
# -----------------------------
class CalendarEvent(BaseModel):
    date: datetime.date
    type: str  # "crop_plan", "irrigation", "pest", "manual", etc.
    title: str
    description: str | None = None
    related_id: int | None = None


# -----------------------------
# Base para eventos MANUALES (CRUD)
# -----------------------------
class CalendarEventBase(BaseModel):
    date: datetime.date
    type: str
    title: str
    description: str | None = None


# -----------------------------
# Crear evento manual
# -----------------------------
class CalendarEventCreate(CalendarEventBase):
    pass


# -----------------------------
# Actualizar evento manual
# -----------------------------
class CalendarEventUpdate(BaseModel):
    date: datetime.date | None = None
    type: str | None = None
    title: str | None = None
    description: str | None = None


# -----------------------------
# Leer evento manual (respuesta)
# -----------------------------
class CalendarEventRead(CalendarEventBase):
    id: int

    class Config:
        from_attributes = True
