from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ClimateEvent(Base):
    __tablename__ = "climate_events"

    id = Column(Integer, primary_key=True, index=True)
    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=False)

    date = Column(Date, nullable=False)
    type = Column(String, nullable=False)
    intensity = Column(Float, nullable=False)
    description = Column(String, nullable=False)

    # 🔥 Nuevo campo: nivel de riesgo agrícola
    # Valores posibles: none | medium | high
    risk_level = Column(String, default="none", nullable=False)

    plot = relationship("Plot", back_populates="climate_events")
