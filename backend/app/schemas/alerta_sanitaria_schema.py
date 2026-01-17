from pydantic import BaseModel
from datetime import date


# -----------------------------
# BASE
# -----------------------------
class AlertaSanitariaBase(BaseModel):
    cultivo_parcela_id: int
    fecha: date
    riesgo: str
    probabilidad: float
    prioridad: str
    mensaje: str


# -----------------------------
# CREATE
# -----------------------------
class AlertaSanitariaCreate(AlertaSanitariaBase):
    pass


# -----------------------------
# UPDATE
# -----------------------------
class AlertaSanitariaUpdate(BaseModel):
    estado: str | None = None


# -----------------------------
# READ
# -----------------------------
class AlertaSanitariaRead(AlertaSanitariaBase):
    id: int
    estado: str

    class Config:
        from_attributes = True
