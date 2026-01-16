# app/schemas/tratamiento_schema.py

from pydantic import BaseModel


class TratamientoBase(BaseModel):
    nombre: str
    tipo: str  # "preventivo" | "curativo"
    duracion_dias: int | None = None
    frecuencia_dias: int | None = None
    descripcion: str | None = None
    productos: str | None = None
    # Estaciones del año en las que aplica este tratamiento
    # Ej: ["invierno", "primavera"]
    estaciones: list[str] = []


class TratamientoCreate(TratamientoBase):
    # Nombres de plagas a las que aplica este tratamiento
    plagas: list[str] = []
    # Nombres de enfermedades a las que aplica este tratamiento
    enfermedades: list[str] = []


class TratamientoRead(TratamientoBase):
    id: int

    class Config:
        from_attributes = True
