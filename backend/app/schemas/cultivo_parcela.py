# app/schemas/cultivo_parcela.py
from pydantic import BaseModel
from typing import Optional

class CultivoParcelaBase(BaseModel):
    cultivo_tipo_id: int
    parcela_id: int
    fecha_siembra: Optional[str] = None
    fecha_cosecha: Optional[str] = None
    estado: Optional[str] = "activo"  # activo | cosechado | muerto

class CultivoParcelaCreate(CultivoParcelaBase):
    pass

class CultivoParcelaUpdate(BaseModel):
    cultivo_tipo_id: Optional[int] = None
    parcela_id: Optional[int] = None
    fecha_siembra: Optional[str] = None
    fecha_cosecha: Optional[str] = None
    estado: Optional[str] = None

class CultivoParcelaRead(CultivoParcelaBase):
    id: int

    class Config:
        from_attributes = True
