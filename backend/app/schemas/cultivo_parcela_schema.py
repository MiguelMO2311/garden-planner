from pydantic import BaseModel
from typing import Optional
from datetime import date

class CultivoTipoNested(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class ParcelaNested(BaseModel):
    id: int
    name: str   # ← IMPORTANTE: name, NO nombre

    class Config:
        from_attributes = True

class CultivoParcelaBase(BaseModel):
    cultivo_tipo_id: int
    parcela_id: int
    fecha_siembra: Optional[date] = None
    estado: Optional[str] = "activo"

class CultivoParcelaCreate(CultivoParcelaBase):
    pass

class CultivoParcelaUpdate(BaseModel):
    cultivo_tipo_id: Optional[int] = None
    parcela_id: Optional[int] = None
    fecha_siembra: Optional[date] = None
    estado: Optional[str] = None

class CultivoParcelaRead(BaseModel):
    id: int
    cultivo_tipo: CultivoTipoNested
    parcela: ParcelaNested
    fecha_siembra: Optional[date]
    fecha_cosecha: Optional[date]
    estado: Optional[str]

    class Config:
        from_attributes = True
