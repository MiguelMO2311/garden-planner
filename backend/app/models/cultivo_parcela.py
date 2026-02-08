import json
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class CultivoParcela(Base):
    __tablename__ = "cultivos_parcela"

    id = Column(Integer, primary_key=True, index=True)
    litros_agua_semana = Column(Float, nullable=True)

    fecha_siembra = Column(Date, nullable=False)
    fecha_cosecha = Column(Date, nullable=True)

    estado = Column(String, nullable=False, default="activo")

    cultivo_tipo_id = Column(Integer, ForeignKey("cultivo_tipo.id"), nullable=False)
    parcela_id = Column(Integer, ForeignKey("plots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relaciones principales
    cultivo_tipo = relationship("CultivoTipo", back_populates="cultivos_parcela")
    parcela = relationship("Plot", back_populates="cultivos")
    user = relationship("User", back_populates="cultivos_parcela")

    tareas = relationship("Tarea", back_populates="cultivo_parcela", cascade="all, delete-orphan")
    planes = relationship("CultivoPlan", back_populates="cultivo")

    # ---------------------------------------------------------
    # 🔥 CAMPOS JSON (SQLite → TEXT)
    # ---------------------------------------------------------
    plagas_detectadas_raw = Column("plagas_detectadas", Text, default="[]")
    enfermedades_detectadas_raw = Column("enfermedades_detectadas", Text, default="[]")
    tratamientos_raw = Column("tratamientos", Text, default="[]")

    # ---------------------------------------------------------
    # 🔥 PROPIEDADES PYTHON PARA FASTAPI (listas reales)
    # ---------------------------------------------------------
    @property
    def plagas_detectadas(self):
        try:
            return json.loads(self.plagas_detectadas_raw or "[]")
        except:
            return []

    @plagas_detectadas.setter
    def plagas_detectadas(self, value):
        self.plagas_detectadas_raw = json.dumps(value or [])

    @property
    def enfermedades_detectadas(self):
        try:
            return json.loads(self.enfermedades_detectadas_raw or "[]")
        except:
            return []

    @enfermedades_detectadas.setter
    def enfermedades_detectadas(self, value):
        self.enfermedades_detectadas_raw = json.dumps(value or [])

    @property
    def tratamientos(self):
        try:
            return json.loads(self.tratamientos_raw or "[]")
        except:
            return []

    @tratamientos.setter
    def tratamientos(self, value):
        self.tratamientos_raw = json.dumps(value or [])

    # ---------------------------------------------------------
    # 🔥 RELACIONES SANITARIAS (ORM reales)
    # ---------------------------------------------------------
    plagas = relationship("Plaga", back_populates="cultivo_parcela", cascade="all, delete-orphan")

    # ⭐ ESTA RELACIÓN FALTABA — ES LA QUE ROMPÍA TODO
    enfermedades_detectadas_rel = relationship(
        "Enfermedad",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )

    tratamientos_aplicados = relationship(
        "TratamientoAplicado",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )

    recomendaciones = relationship(
        "Recomendacion",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )

    eventos_sanitarios = relationship(
        "EventoSanitario",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )

    alertas_sanitarias = relationship(
        "AlertaSanitaria",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )

    riesgos_climaticos = relationship(
        "RiesgoClimatico",
        back_populates="cultivo_parcela",
        cascade="all, delete-orphan"
    )
