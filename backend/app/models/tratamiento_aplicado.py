from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class TratamientoAplicado(Base):
    __tablename__ = "tratamientos_aplicados"

    id = Column(Integer, primary_key=True, index=True)

    tratamiento_id = Column(
        Integer,
        ForeignKey("tratamientos.id", ondelete="CASCADE"),
        nullable=False
    )

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha_inicio = Column(Date, nullable=False)
    fecha_fin_prevista = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)

    estado = Column(String, default="en_progreso")
    observaciones = Column(String, nullable=True)

    # 🔥 RELACIÓN CORRECTA Y NECESARIA
    tratamiento = relationship("Tratamiento", back_populates="aplicaciones")

    # 🔥 RELACIÓN SANITARIA CORRECTA
    cultivo_parcela = relationship("CultivoParcela", back_populates="tratamientos_aplicados")
