from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Tratamiento(Base):
    __tablename__ = "tratamientos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    tipo = Column(String, nullable=False)  # "preventivo" | "curativo"
    duracion_dias = Column(Integer, nullable=True)
    frecuencia_dias = Column(Integer, nullable=True)
    descripcion = Column(String, nullable=True)
    productos = Column(String, nullable=True)
    estaciones = Column(JSON, nullable=True)

    # 🔥 aplicaciones reales sobre cultivos en parcela
    aplicaciones = relationship(
        "TratamientoAplicado",
        back_populates="tratamiento",
        cascade="all, delete-orphan"
    )
