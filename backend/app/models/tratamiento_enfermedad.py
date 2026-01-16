# ---------------------------------------------------------
# TABLA INTERMEDIA: Tratamiento ↔ Enfermedad
# ---------------------------------------------------------
# Un tratamiento puede aplicarse a varias enfermedades.
# Una enfermedad puede tener varios tratamientos.
# ---------------------------------------------------------

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class TratamientoEnfermedad(Base):
    __tablename__ = "tratamiento_enfermedad"

    id = Column(Integer, primary_key=True, index=True)
    tratamiento_id = Column(Integer, ForeignKey("tratamientos.id", ondelete="CASCADE"))
    enfermedad_id = Column(Integer, ForeignKey("enfermedades.id", ondelete="CASCADE"))

    __table_args__ = (
        UniqueConstraint("tratamiento_id", "enfermedad_id", name="uq_tratamiento_enfermedad"),
    )
