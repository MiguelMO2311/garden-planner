from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# ---------------------------------------------------------
# NESTED: CultivoTipo
# ---------------------------------------------------------
class CultivoTipoNested(BaseModel):
    id: int
    nombre: str
    tipo: str
    fase_lunar: Optional[str] = None
    plagas: List[str] = []
    enfermedades: List[str] = []
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------
# NESTED: Parcela
# ---------------------------------------------------------
class ParcelaNested(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ---------------------------------------------------------
# BASE
# ---------------------------------------------------------
class CultivoParcelaBase(BaseModel):
    cultivo_tipo_id: int
    parcela_id: int
    fecha_siembra: Optional[date] = None
    estado: Optional[str] = "activo"

    # ⭐ CAMPOS JSON QUE FALTABAN ⭐
    plagas_detectadas: List[str] = []
    enfermedades_detectadas: List[str] = []
    tratamientos: List[dict] = []


# ---------------------------------------------------------
# CREATE
# ---------------------------------------------------------
class CultivoParcelaCreate(CultivoParcelaBase):
    pass


# ---------------------------------------------------------
# UPDATE
# ---------------------------------------------------------
class CultivoParcelaUpdate(BaseModel):
    cultivo_tipo_id: Optional[int] = None
    parcela_id: Optional[int] = None
    fecha_siembra: Optional[date] = None
    estado: Optional[str] = None

    # ⭐ CAMPOS JSON OPCIONALES (CRÍTICO) ⭐
    plagas_detectadas: Optional[List[str]] = None
    enfermedades_detectadas: Optional[List[str]] = None
    tratamientos: Optional[List[dict]] = None


# ---------------------------------------------------------
# READ
# ---------------------------------------------------------
class CultivoParcelaRead(BaseModel):
    id: int
    cultivo_tipo: CultivoTipoNested
    parcela: ParcelaNested
    fecha_siembra: Optional[date]
    fecha_cosecha: Optional[date]
    estado: Optional[str]

    plagas_detectadas: List[str] = []
    enfermedades_detectadas: List[str] = []
    tratamientos: List[dict] = []

    class Config:
        from_attributes = True