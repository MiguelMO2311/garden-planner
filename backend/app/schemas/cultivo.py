from pydantic import BaseModel
from typing import Optional


class CultivoBase(BaseModel):
    nombre: str
    temporada_optima: Optional[str] = None
    dias_crecimiento: Optional[int] = None
    litros_agua_semana: Optional[float] = None
    notas: Optional[str] = None

    # Relación con la parcela
    plot_id: int


class CultivoCreate(CultivoBase):
    pass


class CultivoRead(CultivoBase):
    id: int

    model_config = {
        "from_attributes": True
    }
