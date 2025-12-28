from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cultivo(Base):
    __tablename__ = "cultivos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    temporada_optima = Column(String, nullable=True)
    dias_crecimiento = Column(Integer, nullable=True)
    litros_agua_semana = Column(Float, nullable=True)
    notas = Column(String, nullable=True)

    # Relaciones
    plot_id = Column(Integer, ForeignKey("plots.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    plot = relationship("Plot", back_populates="cultivos")
    tareas = relationship("Tarea", back_populates="cultivo")

