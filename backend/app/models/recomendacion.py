from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Recomendacion(Base):
    __tablename__ = "recomendaciones"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 Relación correcta: pertenece a un cultivo en parcela
    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    # Texto de la recomendación
    mensaje = Column(String, nullable=False)

    # Fecha automática
    fecha = Column(DateTime, server_default=func.now())

    # 🔥 Relación inversa con CultivoParcela
    cultivo_parcela = relationship("CultivoParcela", back_populates="recomendaciones")
