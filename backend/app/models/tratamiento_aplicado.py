from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
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
    fecha_fin = Column(Date, nullable=True)

    activo = Column(Boolean, default=True)
    observaciones = Column(String, nullable=True)

    tratamiento = relationship("Tratamiento", back_populates="aplicaciones")
    cultivo_parcela = relationship("CultivoParcela", back_populates="tratamientos_aplicados")
