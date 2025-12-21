from pydantic import BaseModel
from typing import Optional

class CropBase(BaseModel):
    name: str
    optimal_season: Optional[str] = None
    growth_days: Optional[int] = None
    water_liters_week: Optional[float] = None
    notes: Optional[str] = None

class CropCreate(CropBase):
    pass

class CropRead(CropBase):
    id: int

    model_config = {
    "from_attributes": True
}

