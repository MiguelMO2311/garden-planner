from pydantic import BaseModel
from datetime import date

class AlertaSanitariaRead(BaseModel):
    id: int
    cultivo_parcela_id: int
    fecha: date
    riesgo: str
    probabilidad: float
    prioridad: str
    mensaje: str

    class Config:
        from_attributes = True
