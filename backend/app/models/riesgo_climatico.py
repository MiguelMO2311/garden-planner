from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class RiesgoClimatico(Base):
    __tablename__ = "riesgos_climaticos"

    id = Column(Integer, primary_key=True, index=True)

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha = Column(Date, nullable=False)
    riesgo = Column(String, nullable=False)
    probabilidad = Column(Float, nullable=False)

    temperatura = Column(Float, nullable=True)
    humedad = Column(Float, nullable=True)
    lluvia = Column(Float, nullable=True)

    estado = Column(String, default="activo")  # activo / archivado

    cultivo_parcela = relationship("CultivoParcela", back_populates="riesgos_climaticos")
