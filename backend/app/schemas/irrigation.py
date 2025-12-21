from pydantic import BaseModel
from datetime import date

class IrrigationBase(BaseModel):
    plot_id: int
    liters: float
    date: date

class IrrigationCreate(IrrigationBase):
    pass

class IrrigationRead(IrrigationBase):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }
