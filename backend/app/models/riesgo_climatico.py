from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class RiesgoClimatico(Base):
    __tablename__ = "riesgos_climaticos"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 ForeignKey corregido: tabla en plural
    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha = Column(Date, nullable=False)

    # Ej: "mildiu", "araña roja", "oídio"
    riesgo = Column(String, nullable=False)

    # Valor entre 0 y 1
    probabilidad = Column(Float, nullable=False)

    # Datos climáticos usados
    temperatura = Column(Float, nullable=True)
    humedad = Column(Float, nullable=True)
    lluvia = Column(Float, nullable=True)

    # 🔥 Relación inversa correcta
    cultivo_parcela = relationship(
        "CultivoParcela",
        back_populates="riesgos_climaticos"
    )
