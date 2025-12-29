# app/schemas/cultivo.py
from pydantic import BaseModel
from typing import Optional

class CultivoBase(BaseModel):
    nombre: str
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None
    plot_id: int

class CultivoCreate(CultivoBase):
    pass

class CultivoUpdate(BaseModel):
    nombre: Optional[str] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None
    plot_id: Optional[int] = None

class CultivoRead(CultivoBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
