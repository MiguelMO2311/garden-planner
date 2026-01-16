from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class CultivoTipoPlaga(Base):
    __tablename__ = "cultivo_tipo_plaga"

    id = Column(Integer, primary_key=True, index=True)
    cultivo_tipo_id = Column(Integer, ForeignKey("cultivo_tipo.id", ondelete="CASCADE"))
    plaga_id = Column(Integer, ForeignKey("plagas.id", ondelete="CASCADE"))

    __table_args__ = (
        UniqueConstraint("cultivo_tipo_id", "plaga_id", name="uq_cultivo_plaga"),
    )
