from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class AlertaSanitaria(Base):
    __tablename__ = "alertas_sanitarias"

    id = Column(Integer, primary_key=True, index=True)

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    fecha = Column(Date, nullable=False)
    riesgo = Column(String, nullable=False)
    probabilidad = Column(Float, nullable=False)

    prioridad = Column(String, nullable=False)
    mensaje = Column(String, nullable=False)

    estado = Column(String, default="pendiente")  # pendiente / confirmada / descartada

    cultivo_parcela = relationship("CultivoParcela", back_populates="alertas_sanitarias")
