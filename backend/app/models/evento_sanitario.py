from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class EventoSanitario(Base):
    __tablename__ = "eventos_sanitarios"

    id = Column(Integer, primary_key=True, index=True)

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha = Column(Date, nullable=False)

    # Tipo de evento: plaga / enfermedad / clima
    tipo = Column(String, nullable=False)

    # Nombre de la plaga, enfermedad o condición climática
    objetivo = Column(String, nullable=False)

    # Datos sanitarios
    riesgo = Column(String, nullable=True)  
    probabilidad = Column(Float, nullable=True)

    notas = Column(String, nullable=True)

    # Estado del evento
    estado = Column(String, default="activa")  

    # Tratamiento aplicado que resuelve el evento (opcional)
    tratamiento_id = Column(
        Integer,
        ForeignKey("tratamientos_aplicados.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relación con sugerencia sanitaria generada
    recomendacion_id = Column(
        Integer,
        ForeignKey("sugerencias_sanitarias.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relaciones ORM
    cultivo_parcela = relationship("CultivoParcela", back_populates="eventos_sanitarios")
    tratamiento = relationship("TratamientoAplicado")
    recomendacion = relationship("SugerenciaSanitaria")
