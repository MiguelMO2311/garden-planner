from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Recomendacion(Base):
    __tablename__ = "recomendaciones"

    id = Column(Integer, primary_key=True, index=True)

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    mensaje = Column(String, nullable=False)

    fecha_sugerida = Column(Date, nullable=True)
    estado = Column(String, default="pendiente")  # pendiente / realizada / descartada

    cultivo_parcela = relationship("CultivoParcela", back_populates="recomendaciones")
