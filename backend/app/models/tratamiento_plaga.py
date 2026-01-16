# ---------------------------------------------------------
# TABLA INTERMEDIA: Tratamiento ↔ Plaga
# ---------------------------------------------------------
# Un tratamiento puede aplicarse a varias plagas.
# Una plaga puede tener varios tratamientos.
# ---------------------------------------------------------

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class TratamientoPlaga(Base):
    __tablename__ = "tratamiento_plaga"

    id = Column(Integer, primary_key=True, index=True)
    tratamiento_id = Column(Integer, ForeignKey("tratamientos.id", ondelete="CASCADE"))
    plaga_id = Column(Integer, ForeignKey("plagas.id", ondelete="CASCADE"))

    __table_args__ = (
        UniqueConstraint("tratamiento_id", "plaga_id", name="uq_tratamiento_plaga"),
    )
