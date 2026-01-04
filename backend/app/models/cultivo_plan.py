from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoPlan(Base):
    __tablename__ = "cultivo_plans"

    id = Column(Integer, primary_key=True, index=True)

    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=False)
    cultivo_id = Column(Integer, ForeignKey("cultivos.id"), nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 🔥 Relación correcta con usuario
    user = relationship("User", back_populates="cultivo_plans")

    # 🔥 Relación correcta con parcela
    plot = relationship("Plot", back_populates="cultivo_plans")

    # 🔥 Relación correcta con cultivo
    cultivo = relationship("Cultivo", back_populates="cultivo_plans")
