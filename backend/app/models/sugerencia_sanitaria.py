from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class SugerenciaSanitaria(Base):
    __tablename__ = "sugerencias_sanitarias"

    id = Column(Integer, primary_key=True, index=True)
    cultivo_parcela_id = Column(Integer, ForeignKey("cultivo_parcela.id", ondelete="CASCADE"))
    fecha = Column(Date, nullable=False)

    riesgo = Column(String, nullable=False)
    probabilidad = Column(Float, nullable=False)

    tratamiento_id = Column(Integer, ForeignKey("tratamientos.id", ondelete="SET NULL"))
    mensaje = Column(String, nullable=False)

    cultivo_parcela = relationship("CultivoParcela")
    tratamiento = relationship("Tratamiento")
