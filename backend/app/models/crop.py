from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    optimal_season = Column(String, nullable=True)
    growth_days = Column(Integer, nullable=True)
    water_liters_week = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
