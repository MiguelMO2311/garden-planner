from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.schemas.plot import PlotRead
from app.schemas.cultivo_parcela import CultivoParcelaRead

class TareaBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    estado: Optional[str] = "pendiente"

    cultivo_parcela_id: int
    parcela_id: int


class TareaCreate(TareaBase):
    pass


class TareaUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    estado: Optional[str] = None

    cultivo_parcela_id: Optional[int] = None
    parcela_id: Optional[int] = None


class TareaRead(TareaBase):
    id: int
    parcela: Optional[PlotRead] = None
    cultivo_parcela: Optional[CultivoParcelaRead] = None

    class Config:
        from_attributes = True
