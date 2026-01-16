from pydantic import BaseModel
from datetime import date

class SugerenciaSanitariaRead(BaseModel):
    id: int
    cultivo_parcela_id: int
    fecha: date
    riesgo: str
    probabilidad: float
    tratamiento_id: int
    mensaje: str

    class Config:
        from_attributes = True
