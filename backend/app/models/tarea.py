from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    fecha = Column(Date, nullable=True)

    cultivo_id = Column(Integer, ForeignKey("cultivos.id"), nullable=False)
    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=True)

    cultivo = relationship("Cultivo", back_populates="tareas")
    parcela = relationship("Plot", back_populates="tareas")
