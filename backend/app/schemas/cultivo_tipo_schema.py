from pydantic import BaseModel
from typing import Optional

class CultivoTipoBase(BaseModel):
    nombre: str
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None

class CultivoTipoCreate(CultivoTipoBase):
    pass

class CultivoTipoUpdate(BaseModel):
    nombre: Optional[str] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None

class CultivoTipoRead(CultivoTipoBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
