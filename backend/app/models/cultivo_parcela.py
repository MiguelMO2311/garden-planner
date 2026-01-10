from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoParcela(Base):
    __tablename__ = "cultivo_parcela"

    id = Column(Integer, primary_key=True, index=True)
    litros_agua_semana = Column(Float, nullable=True)

    fecha_siembra = Column(Date, nullable=False)
    fecha_cosecha = Column(Date, nullable=True)

    estado = Column(String, nullable=False, default="activo")

    cultivo_tipo_id = Column(Integer, ForeignKey("cultivo_tipo.id"), nullable=False)
    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    cultivo_tipo = relationship("CultivoTipo", back_populates="cultivos_parcela")
    parcela = relationship("Plot", back_populates="cultivos")
    user = relationship("User", back_populates="cultivo_parcela")
    tareas = relationship("Tarea", back_populates="cultivo_parcela")
    planes = relationship("CultivoPlan", back_populates="cultivo")
