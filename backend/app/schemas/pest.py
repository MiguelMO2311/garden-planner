from pydantic import BaseModel
from datetime import date

class PestBase(BaseModel):
    plot_id: int
    name: str
    severity: str | None = None
    date_detected: date
    notes: str | None = None

class PestCreate(PestBase):
    pass

class PestRead(PestBase):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }
