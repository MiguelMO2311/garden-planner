from pydantic import BaseModel
from typing import Optional
from datetime import date

class TareaFromRecommendation(BaseModel):
    plot_id: int
    recommendation_type: str
    message: str
    fecha: Optional[date] = None
