from pydantic import BaseModel
from datetime import date

class CropPlanBase(BaseModel):
    plot_id: int
    crop_id: int
    start_date: date
    end_date: date | None = None
    notes: str | None = None

class CropPlanCreate(CropPlanBase):
    pass

class CropPlanRead(CropPlanBase):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }
