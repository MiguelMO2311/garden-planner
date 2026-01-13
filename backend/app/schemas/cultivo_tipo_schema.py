# app/schemas/cultivo_tipo_schema.py

from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class TipoCultivo(str, Enum):
    fruto = "Fruto"
    hoja = "Hoja"
    raiz = "Raíz"
    flor = "Flor"
    leguminosa = "Leguminosa"
    tuberculo = "Tubérculo"
    aromatica = "Aromática"

class FaseLunar(str, Enum):
    creciente = "Creciente"
    llena = "Llena"
    nueva = "Nueva"
    menguante = "Menguante"

class CultivoTipoBase(BaseModel):
    nombre: str
    nombre_latin: Optional[str] = None
    variedad: Optional[str] = None

    # En el modelo SQLAlchemy son String, pero aquí mantenemos Enum (Pydantic lo convierte)
    tipo: Optional[TipoCultivo] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None

    fase_lunar: Optional[FaseLunar] = None

    # En SQLite se guardan como JSON string, pero aquí siguen siendo listas
    plagas: Optional[List[str]] = None
    enfermedades: Optional[List[str]] = None

    plazo_seguridad: Optional[int] = None
    frecuencia_tratamiento: Optional[int] = None
    temperatura_minima: Optional[float] = None
    temperatura_optima: Optional[float] = None
    exigencia_hidrica: Optional[str] = None
    exigencia_nutrientes: Optional[str] = None

    notas: Optional[str] = None

class CultivoTipoCreate(CultivoTipoBase):
    pass

class CultivoTipoUpdate(BaseModel):
    nombre: Optional[str] = None
    nombre_latin: Optional[str] = None
    variedad: Optional[str] = None

    tipo: Optional[TipoCultivo] = None
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None

    fase_lunar: Optional[FaseLunar] = None
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
    user_id: int

    class Config:
        from_attributes = True
