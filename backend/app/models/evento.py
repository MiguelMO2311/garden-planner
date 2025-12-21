from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base

class EventoAgricola(Base):
    __tablename__ = "eventos_agricolas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    tipo = Column(String, default="tarea")
    descripcion = Column(String, nullable=True)
    tarea_id = Column(Integer, nullable=True)

    color = Column(String, default="#2563eb")  # azul por defecto

