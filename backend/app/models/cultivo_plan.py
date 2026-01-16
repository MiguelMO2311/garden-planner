from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoPlan(Base):
    __tablename__ = "cultivo_plans"

    id = Column(Integer, primary_key=True, index=True)

    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=False)

    # 🔥 ForeignKey corregido: tabla correcta = "cultivos_parcela"
    cultivo_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relación con usuario
    user = relationship("User", back_populates="cultivo_plans")

    # Relación con parcela
    plot = relationship("Plot", back_populates="cultivo_plans")

    # Relación con cultivo plantado
    cultivo = relationship("CultivoParcela", back_populates="planes")
