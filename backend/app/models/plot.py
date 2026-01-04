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

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 🔥 Relación correcta con User
    user = relationship("User", back_populates="parcelas")

    # relación con riegos
    irrigations = relationship("Irrigation", back_populates="plot")

    # relación con cultivos
    cultivos = relationship("Cultivo", back_populates="plot", cascade="all, delete")

    # relación con tareas
    tareas = relationship("Tarea", back_populates="parcela")
    
    # relación con plagas
    pests = relationship("Pest", back_populates="plot")

    # relación con planes de cultivo
    cultivo_plans = relationship("CultivoPlan", back_populates="plot")