# app/models/cultivo_tipo.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
import json

class TipoCultivo(str, enum.Enum):
    fruto = "Fruto"
    hoja = "Hoja"
    raiz = "Raíz"
    flor = "Flor"
    leguminosa = "Leguminosa"
    tuberculo = "Tubérculo"
    aromatica = "Aromática"

class FaseLunar(str, enum.Enum):
    creciente = "Creciente"
    llena = "Llena"
    nueva = "Nueva"
    menguante = "Menguante"

class CultivoTipo(Base):
    __tablename__ = "cultivo_tipo"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    nombre_latin = Column(String, nullable=True)
    variedad = Column(String, nullable=True)

    # En SQLite no existe Enum → se guarda como String
    tipo = Column(String, nullable=True)

    temporada_optima = Column(String, nullable=True)
    dias_crecimiento = Column(Integer, nullable=True)
    litros_agua_semana = Column(Float, nullable=True)

    # Igual: Enum → String
    fase_lunar = Column(String, nullable=True)

    # En SQLite no existe ARRAY → se guarda como JSON (String)
    plagas = Column(String, nullable=True)          # JSON
    enfermedades = Column(String, nullable=True)    # JSON

    plazo_seguridad = Column(Integer, nullable=True)
    frecuencia_tratamiento = Column(Integer, nullable=True)
    temperatura_minima = Column(Float, nullable=True)
    temperatura_optima = Column(Float, nullable=True)
    exigencia_hidrica = Column(String, nullable=True)
    exigencia_nutrientes = Column(String, nullable=True)

    notas = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="cultivo_tipo")

    cultivos_parcela = relationship("CultivoParcela", back_populates="cultivo_tipo")

    # Helpers opcionales para convertir JSON <-> lista
    def set_plagas(self, lista):
        self.plagas = json.dumps(lista)

    def get_plagas(self):
        return json.loads(self.plagas) if self.plagas else []

    def set_enfermedades(self, lista):
        self.enfermedades = json.dumps(lista)

    def get_enfermedades(self):
        return json.loads(self.enfermedades) if self.enfermedades else []
