from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    name = Column(String, nullable=True)     # nombre visible en el frontend
    avatar = Column(String, default="/static/avatars/default.jpg", nullable=True)

    # --- Relaciones con otras entidades ---
    
    # Riegos
    irrigations = relationship("Irrigation", back_populates="user")

    # Tareas
    tareas = relationship("Tarea", back_populates="user")

    # Parcelas
    parcelas = relationship("Plot", back_populates="user")

    # Tipos de cultivo (catálogo del usuario)
    cultivo_tipo = relationship("CultivoTipo", back_populates="user")

    # Cultivos plantados en parcelas
    cultivo_parcela = relationship("CultivoParcela", back_populates="user")

    # Planes de cultivo
    cultivo_plans = relationship("CultivoPlan", back_populates="user")

# Plagas
    pests = relationship("Pest", back_populates="user")

    # Eventos manuales del calendario
    calendar_events = relationship("CalendarEventManual", back_populates="user")

    #eventos agricolas
    eventos_agricolas = relationship("EventoAgricola", back_populates="user")
