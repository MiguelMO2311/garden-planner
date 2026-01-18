from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class EventoSanitario(Base):
    __tablename__ = "eventos_sanitarios"

    id = Column(Integer, primary_key=True, index=True)

    # Relación correcta: el evento pertenece a un cultivo en parcela
    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha = Column(Date, nullable=False)

    # Datos sanitarios
    riesgo = Column(String, nullable=True)
    probabilidad = Column(Float, nullable=True)

    objetivo = Column(String, nullable=True)
    notas = Column(String, nullable=True)

    # Estado del evento
    estado = Column(String, default="activa")  # activa / resuelta

    # Tratamiento aplicado que resuelve el evento (opcional)
    tratamiento_id = Column(
        Integer,
        ForeignKey("tratamientos_aplicados.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relaciones ORM
    cultivo_parcela = relationship("CultivoParcela", back_populates="eventos_sanitarios")
    tratamiento = relationship("TratamientoAplicado")
