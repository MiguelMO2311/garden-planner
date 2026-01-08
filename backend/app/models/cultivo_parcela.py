from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoParcela(Base):
    __tablename__ = "cultivo_parcela"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    temporada_optima = Column(String, nullable=True)
    dias_crecimiento = Column(Integer, nullable=True)
    litros_agua_semana = Column(Float, nullable=True)
    notas = Column(String, nullable=True)

    plot_id = Column(Integer, ForeignKey("plots.id"), nullable=False)

    # 🔥 ESTA ES LA CLAVE QUE FALTABA
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones
    plot = relationship("Plot", back_populates="cultivos")
    user = relationship("User", back_populates="cultivo_parcela")
    tareas = relationship("Tarea", back_populates="cultivo_parcela")

    # Relación con planes de cultivo
    planes = relationship("CultivoPlan", back_populates="cultivo")
