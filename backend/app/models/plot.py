from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Plot(Base):
    __tablename__ = "plots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)
    size_m2 = Column(Float, nullable=True)

    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="parcelas")

    irrigations = relationship("Irrigation", back_populates="plot")

    cultivos = relationship(
        "CultivoParcela",
        back_populates="parcela",
        cascade="all, delete-orphan"
    )

    tareas = relationship("Tarea", back_populates="parcela", cascade="all, delete-orphan")

    cultivo_plans = relationship("CultivoPlan", back_populates="plot")

    climate_events = relationship(
        "ClimateEvent",
        back_populates="plot",
        cascade="all, delete-orphan"
    )
