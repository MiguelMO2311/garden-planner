from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha = Column(Date, nullable=True)
    estado = Column(String, default="pendiente")

    # Relación correcta con CultivoParcela
    cultivo_parcela_id = Column(Integer, ForeignKey("cultivo_parcela.id"), nullable=False)

    # Relación correcta con parcela
    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=False)

    # Relación con usuario
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    cultivo_parcela = relationship("CultivoParcela", back_populates="tareas")
    parcela = relationship("Plot", back_populates="tareas")
    user = relationship("User", back_populates="tareas")
