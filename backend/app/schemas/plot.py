# app/schemas/plot.py
from pydantic import BaseModel
from typing import Optional


class PlotBase(BaseModel):
    name: str
    location: Optional[str] = None
    soil_type: Optional[str] = None
    size_m2: Optional[float] = None


class PlotCreate(PlotBase):
    pass


class PlotRead(PlotBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class PlotUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    soil_type: Optional[str] = None
    size_m2: Optional[float] = None
