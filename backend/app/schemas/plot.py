# app/schemas/plot.py
from pydantic import BaseModel
from typing import Optional


class PlotBase(BaseModel):
    name: str
    location: Optional[str] = None
    soil_type: Optional[str] = None
    size_m2: Optional[float] = None

    # 🔥 NUEVO: coordenadas geográficas
    lat: Optional[float] = None
    lng: Optional[float] = None


class PlotCreate(PlotBase):
    """
    Esquema para crear una parcela.
    Hereda todos los campos de PlotBase:
    - name (obligatorio)
    - location, soil_type, size_m2, lat, lng (opcionales)
    """
    pass


class PlotRead(PlotBase):
    """
    Esquema para devolver una parcela al frontend.
    Incluye:
    - Campos de PlotBase
    - id
    - user_id
    """
    id: int
    user_id: int

    class Config:
        from_attributes = True


class PlotUpdate(BaseModel):
    """
    Esquema para actualización parcial de una parcela (PATCH/PUT).
    Todos los campos opcionales.
    """
    name: Optional[str] = None
    location: Optional[str] = None
    soil_type: Optional[str] = None
    size_m2: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
