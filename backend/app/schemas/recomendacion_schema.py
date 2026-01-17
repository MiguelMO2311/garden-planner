from pydantic import BaseModel
from datetime import datetime, date


# -----------------------------
# BASE
# -----------------------------
class RecomendacionBase(BaseModel):
    parcela_id: int
    mensaje: str
    fecha: date


# -----------------------------
# CREATE
# -----------------------------
class RecomendacionCreate(RecomendacionBase):
    pass


# -----------------------------
# UPDATE
# -----------------------------
class RecomendacionUpdate(BaseModel):
    estado: str | None = None


# -----------------------------
# READ
# -----------------------------
class RecomendacionRead(RecomendacionBase):
    id: int

    class Config:
        from_attributes = True
