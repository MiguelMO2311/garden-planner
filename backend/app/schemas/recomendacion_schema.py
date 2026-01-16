from pydantic import BaseModel
from datetime import datetime


class RecomendacionRead(BaseModel):
    id: int
    parcela_id: int
    mensaje: str
    fecha: datetime

    class Config:
        from_attributes = True
