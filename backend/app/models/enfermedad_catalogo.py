from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

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
