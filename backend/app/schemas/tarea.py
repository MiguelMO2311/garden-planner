from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.schemas.plot import PlotRead
from app.schemas.cultivo import CultivoRead

# -----------------------------
# BASE: usado por create/update
# -----------------------------
class TareaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    estado: Optional[str] = "pendiente"
    cultivo_id: int
    parcela_id: int



# -----------------------------
# CREATE: igual que base
# -----------------------------
class TareaCreate(TareaBase):
    pass


# -----------------------------
# UPDATE: todos los campos opcionales
# -----------------------------
class TareaUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    estado: Optional[str] = None
    cultivo_id: Optional[int] = None
    parcela_id: Optional[int] = None


# -----------------------------
# READ: lo que devuelve el backend
# -----------------------------
class TareaRead(TareaBase):
    id: int
    parcela: Optional[PlotRead] = None
    cultivo: Optional[CultivoRead] = None

    class Config:
        from_attributes = True
