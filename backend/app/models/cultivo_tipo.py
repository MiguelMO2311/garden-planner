from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoTipo(Base):
    __tablename__ = "cultivo_tipo"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    temporada_optima = Column(String, nullable=True)
    dias_crecimiento = Column(Integer, nullable=True)
    litros_agua_semana = Column(Float, nullable=True)
    notas = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relación correcta con usuario
    user = relationship("User", back_populates="cultivo_tipo")
