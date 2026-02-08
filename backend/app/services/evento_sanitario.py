from datetime import date
from sqlalchemy.orm import Session

from app.models.evento_sanitario import EventoSanitario
from app.models.sugerencia_sanitaria import SugerenciaSanitaria
from app.models.tratamiento import Tratamiento
from app.models.cultivo_parcela import CultivoParcela

from app.services.agro_rules.engine import ejecutar_reglas


# ============================================================
# CREAR EVENTO SANITARIO
# ============================================================

def crear_evento_sanitario(db: Session, cultivo: CultivoParcela, evento_clima, notas=None):

    evento = EventoSanitario(
        cultivo_parcela_id=cultivo.id,
        fecha=date.today(),
        tipo=evento_clima.type,
        objetivo=evento_clima.type,
        riesgo=evento_clima.risk_level,
        probabilidad=1.0,
        notas=notas,
        estado="activa"
    )

    db.add(evento)
    db.commit()
    db.refresh(evento)

    return evento


# ============================================================
# CREAR SUGERENCIA SANITARIA
# ============================================================

def crear_sugerencia_sanitaria(db: Session, cultivo: CultivoParcela, regla: dict):

    tratamiento_id = None

    if regla.get("tratamientos_sugeridos"):
        nombre_trat = regla["tratamientos_sugeridos"][0]
        tratamiento = db.query(Tratamiento).filter(Tratamiento.nombre == nombre_trat).first()
        if tratamiento:
            tratamiento_id = tratamiento.id

    sugerencia = SugerenciaSanitaria(
        cultivo_parcela_id=cultivo.id,
        fecha=date.today(),
        riesgo=regla.get("riesgo", "bajo"),
        probabilidad=1.0,
        tratamiento_id=tratamiento_id,
        mensaje=regla.get("mensaje", "Revisión recomendada.")
    )

    db.add(sugerencia)
    db.commit()
    db.refresh(sugerencia)

    return sugerencia


# ============================================================
# PROCESAR EVENTO SANITARIO COMPLETO
# ============================================================

def procesar_evento_sanitario(db: Session, cultivo: CultivoParcela, evento_clima, contexto=None):

    # 1. Ejecutar motor de reglas
    reglas_aplicadas = ejecutar_reglas(evento_clima, cultivo, contexto)

    if not reglas_aplicadas:
        return None

    # 2. Crear evento sanitario base
    evento = crear_evento_sanitario(
        db=db,
        cultivo=cultivo,
        evento_clima=evento_clima,
        notas=f"Evento climático: {evento_clima.type} ({evento_clima.intensity})"
    )

    sugerencias = []

    # 3. Crear sugerencias sanitarias y vincularlas al evento
    for regla in reglas_aplicadas:
        sugerencia = crear_sugerencia_sanitaria(db, cultivo, regla)

        evento.recomendacion_id = sugerencia.id
        db.commit()
        db.refresh(evento)

        sugerencias.append(sugerencia)

    return {
        "evento": evento,
        "sugerencias": sugerencias,
        "reglas": reglas_aplicadas
    }
