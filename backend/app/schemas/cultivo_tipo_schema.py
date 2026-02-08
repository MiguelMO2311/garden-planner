# app/schemas/cultivo_tipo_schema.py

from pydantic import BaseModel, field_validator
from typing import Optional, List

# 🔥 Ya NO usamos Enum aquí para evitar errores con valores antiguos.
# Si quieres usar Enum en el frontend, perfecto, pero NO en el backend.
class CultivoTipoBase(BaseModel):
    nombre: str
    nombre_latin: Optional[str] = None
    variedad: Optional[str] = None

    tipo: Optional[str] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None

    fase_lunar: Optional[str] = None

    plagas: Optional[List[str]] = []
    enfermedades: Optional[List[str]] = []

    plazo_seguridad: Optional[int] = None
    frecuencia_tratamiento: Optional[int] = None
    temperatura_minima: Optional[float] = None
    temperatura_optima: Optional[float] = None
    exigencia_hidrica: Optional[str] = None
    exigencia_nutrientes: Optional[str] = None

    notas: Optional[str] = None

    # 🔥 Normalizadores para evitar errores con SQLite
    @field_validator("plagas", "enfermedades", mode="before")
    def ensure_list_of_strings(cls, v):
        if v is None:
            return []
        if isinstance(v, list):
            return [str(item) for item in v]
        return []


class CultivoTipoCreate(CultivoTipoBase):
    pass


class CultivoTipoUpdate(BaseModel):
    nombre: Optional[str] = None
    nombre_latin: Optional[str] = None
    variedad: Optional[str] = None

    tipo: Optional[str] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None

    fase_lunar: Optional[str] = None
    plagas: Optional[List[str]] = None
    enfermedades: Optional[List[str]] = None

    plazo_seguridad: Optional[int] = None
    frecuencia_tratamiento: Optional[int] = None
    temperatura_minima: Optional[float] = None
    temperatura_optima: Optional[float] = None
    exigencia_hidrica: Optional[str] = None
    exigencia_nutrientes: Optional[str] = None

    notas: Optional[str] = None


class CultivoTipoRead(CultivoTipoBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True
