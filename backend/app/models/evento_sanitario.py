from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class EventoSanitario(Base):
    __tablename__ = "eventos_sanitarios"

    id = Column(Integer, primary_key=True, index=True)

    # Cultivo en una parcela concreta
    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    # Tratamiento aplicado
    tratamiento_id = Column(
        Integer,
        ForeignKey("tratamientos.id", ondelete="SET NULL"),
        nullable=True
    )

    fecha = Column(Date, nullable=False)
    dosis = Column(String, nullable=True)
    notas = Column(String, nullable=True)

    # Objetivo del tratamiento (opcional)
    objetivo = Column(String, nullable=True)

    cultivo_parcela = relationship("CultivoParcela", back_populates="eventos_sanitarios")
    tratamiento = relationship("Tratamiento")
