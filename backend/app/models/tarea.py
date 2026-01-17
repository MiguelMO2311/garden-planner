from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Tarea(Base):
    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)

    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    fecha = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)

    estado = Column(String, default="pendiente")  # pendiente / en_progreso / completada

    origen = Column(String, default="manual")  # manual / sanitario / riego / cultivo

    cultivo_parcela_id = Column(
        Integer,
        ForeignKey("cultivos_parcela.id", ondelete="CASCADE"),
        nullable=False
    )

    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    tratamiento_id = Column(
        Integer,
        ForeignKey("tratamientos_aplicados.id", ondelete="SET NULL"),
        nullable=True
    )

    cultivo_parcela = relationship("CultivoParcela", back_populates="tareas")
    parcela = relationship("Plot", back_populates="tareas")
    user = relationship("User", back_populates="tareas")
    tratamiento = relationship("TratamientoAplicado")
