from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class CultivoTipoEnfermedad(Base):
    __tablename__ = "cultivo_tipo_enfermedad"

    id = Column(Integer, primary_key=True, index=True)
    cultivo_tipo_id = Column(Integer, ForeignKey("cultivo_tipo.id", ondelete="CASCADE"))
    enfermedad_id = Column(Integer, ForeignKey("enfermedades.id", ondelete="CASCADE"))

    __table_args__ = (
        UniqueConstraint("cultivo_tipo_id", "enfermedad_id", name="uq_cultivo_enfermedad"),
    )
