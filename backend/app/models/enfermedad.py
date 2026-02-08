from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Enfermedad(Base):
    __tablename__ = "enfermedades"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    # Enfermedad de catálogo → asociada a CultivoTipo (opcional)
    cultivo_tipo_id = Column(
        Integer,
        ForeignKey("cultivo_tipo.id", ondelete="CASCADE"),
        nullable=True
    )

    # Enfermedad detectada → asociada a CultivoParcela
    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=True
    )

    # 🔥 RELACIÓN CORRECTA
    cultivo_parcela = relationship(
        "CultivoParcela",
        back_populates="enfermedades_detectadas_rel"
    )


# ---------------------------------------------------------
# Catálogo de enfermedades
# ---------------------------------------------------------

class EnfermedadCatalogo(Base):
    __tablename__ = "enfermedades_catalogo"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    cultivo_tipo_id = Column(
        Integer,
        ForeignKey("cultivo_tipo.id", ondelete="CASCADE"),
        nullable=False
    )

    cultivo_tipo = relationship("CultivoTipo", back_populates="enfermedades_catalogo")
