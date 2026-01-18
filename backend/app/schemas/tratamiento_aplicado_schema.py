# app/schemas/tratamiento_aplicado_schema.py

from pydantic import BaseModel
from datetime import date


# ---------------------------------------------------------
# BASE
# ---------------------------------------------------------
class TratamientoAplicadoBase(BaseModel):
    tratamiento_id: int
    cultivo_parcela_id: int
    fecha_inicio: date | None = None
    observaciones: str | None = None


# ---------------------------------------------------------
# CREATE
# ---------------------------------------------------------
class TratamientoAplicadoCreate(TratamientoAplicadoBase):
    pass


# ---------------------------------------------------------
# READ
# ---------------------------------------------------------
class TratamientoAplicadoRead(BaseModel):
    id: int
    tratamiento_id: int
    cultivo_parcela_id: int
    user_id: int
    fecha_inicio: date
    fecha_fin_prevista: date | None = None
    fecha_fin: date | None = None
    estado: str
    observaciones: str | None = None

    class Config:
        from_attributes = True
