from pydantic import BaseModel
from typing import Optional
from datetime import date

class TareaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    fecha: Optional[date] = None
    cultivo_id: int
    parcela_id: Optional[int] = None

class TareaCreate(TareaBase):
    pass

class TareaRead(TareaBase):
    id: int

    model_config = {
        "from_attributes": True
    }
