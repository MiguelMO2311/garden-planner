from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Pest(Base):
    __tablename__ = "pests"

    id = Column(Integer, primary_key=True, index=True)
    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=False)
    name = Column(String, nullable=False)
    severity = Column(String, nullable=True)
    date_detected = Column(Date, nullable=False)
    notes = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 🔥 Relación correcta con usuario
    user = relationship("User", back_populates="pests")

    # 🔥 Relación correcta con parcela
    plot = relationship("Plot", back_populates="pests")
