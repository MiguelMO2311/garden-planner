# app/models/cultivo_tipo.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoTipo(Base):
    __tablename__ = "cultivo_tipo"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    nombre_latin = Column(String, nullable=True)
    variedad = Column(String, nullable=True)

    tipo = Column(String, nullable=True)

    temporada_optima = Column(String, nullable=True)
    dias_crecimiento = Column(Integer, nullable=True)
    litros_agua_semana = Column(Float, nullable=True)

    fase_lunar = Column(String, nullable=True)

    # JSON (SQLite lo guarda como TEXT)
    plagas = Column(JSON, nullable=True, default=list)
    enfermedades = Column(JSON, nullable=True, default=list)

    plazo_seguridad = Column(Integer, nullable=True)
    frecuencia_tratamiento = Column(Integer, nullable=True)
    temperatura_minima = Column(Float, nullable=True)
    temperatura_optima = Column(Float, nullable=True)
    exigencia_hidrica = Column(String, nullable=True)
    exigencia_nutrientes = Column(String, nullable=True)

    notas = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="cultivo_tipo", lazy="joined")

    # Relación con cultivos en parcela
    cultivos_parcela = relationship("CultivoParcela", back_populates="cultivo_tipo")

    # ⭐ RELACIÓN QUE FALTABA (causante del error)
    enfermedades_catalogo = relationship(
        "EnfermedadCatalogo",
        back_populates="cultivo_tipo",
        cascade="all, delete-orphan"
    )
