from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

from app.models.irrigation import Irrigation
from app.models.tarea import Tarea
from app.models.plot import Plot
from app.models.cultivo_tipo import CultivoTipo
from app.models.cultivo_parcela import CultivoParcela
from app.models.cultivo_plan import CultivoPlan
from app.models.pest import Pest
from app.models.calendar_event import CalendarEvent
from app.models.evento import EventoAgricola


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    name = Column(String, nullable=True)
    avatar = Column(String, default="/static/avatars/default.jpg", nullable=True)

    irrigations = relationship("Irrigation", back_populates="user")
    tareas = relationship("Tarea", back_populates="user")
    parcelas = relationship("Plot", back_populates="user")
    cultivo_tipo = relationship("CultivoTipo", back_populates="user")
    cultivo_parcela = relationship("CultivoParcela", back_populates="user")
    cultivo_plans = relationship("CultivoPlan", back_populates="user")
    pests = relationship("Pest", back_populates="user")
    calendar_events = relationship("CalendarEvent", back_populates="user")

    # 🔥 Corrección importante
    eventos_agricolas = relationship("EventoAgricola", back_populates="user")
