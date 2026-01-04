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

    cultivo_id = Column(Integer, ForeignKey("cultivos.id"), nullable=False)
    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=False)

    # 🔥 NUEVO: relación con el usuario
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    cultivo = relationship("Cultivo", back_populates="tareas")
    parcela = relationship("Plot", back_populates="tareas")
    user = relationship("User", back_populates="tareas")
