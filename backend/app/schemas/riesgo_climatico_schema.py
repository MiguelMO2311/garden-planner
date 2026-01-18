from pydantic import BaseModel
from datetime import date

class RiesgoClimaticoCreate(BaseModel):
    cultivo_parcela_id: int
    fecha: date | None = None
    riesgo: str
    probabilidad: float
    temperatura: float | None = None
    humedad: float | None = None
    lluvia: float | None = None

class RiesgoClimaticoRead(BaseModel):
    id: int
    cultivo_parcela_id: int
    fecha: date
    riesgo: str
    probabilidad: float
    temperatura: float | None = None
    humedad: float | None = None
    lluvia: float | None = None

    class Config:
        from_attributes = True
