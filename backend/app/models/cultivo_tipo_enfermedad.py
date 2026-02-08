from sqlalchemy import Column, Integer, ForeignKey
from app.core.database import Base

class CultivoTipoEnfermedad(Base):
    __tablename__ = "cultivo_tipo_enfermedad"

    cultivo_tipo_id = Column(Integer, ForeignKey("cultivo_tipo.id"), primary_key=True)
    enfermedad_id = Column(Integer, ForeignKey("enfermedades.id"), primary_key=True)
