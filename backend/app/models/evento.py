from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class EventoAgricola(Base):
    __tablename__ = "eventos_agricolas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    tipo = Column(String, default="tarea")
    descripcion = Column(String, nullable=True)

    # 🔥 Relación con tarea (si aplica)
    tarea_id = Column(Integer, ForeignKey("tareas.id"), nullable=True)

    # 🔥 Relación con usuario (obligatoria)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    user = relationship("User", back_populates="eventos_agricolas")
    tarea = relationship("Tarea")
