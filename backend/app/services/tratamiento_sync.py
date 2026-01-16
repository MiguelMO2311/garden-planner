from sqlalchemy.orm import Session

from app.models.plaga import Plaga
from app.models.enfermedad import Enfermedad
from app.models.tratamiento_plaga import TratamientoPlaga
from app.models.tratamiento_enfermedad import TratamientoEnfermedad


# ---------------------------------------------------------
# Sincronizar plagas asociadas a un tratamiento
# ---------------------------------------------------------
def sync_tratamiento_plagas(db: Session, tratamiento_id: int, plagas_nombres: list[str]):
    plagas_nombres = [p.strip() for p in plagas_nombres if p.strip()]

    # Obtener plagas existentes
    existing = db.query(Plaga).filter(Plaga.nombre.in_(plagas_nombres)).all()
    existing_names = {p.nombre for p in existing}

    # Crear plagas nuevas si no existen
    for nombre in plagas_nombres:
        if nombre not in existing_names:
            nueva = Plaga(nombre=nombre)
            db.add(nueva)
            db.flush()
            existing.append(nueva)

    final_ids = {p.id for p in existing}

    # Relaciones actuales
    current = (
        db.query(TratamientoPlaga)
        .filter(TratamientoPlaga.tratamiento_id == tratamiento_id)
        .all()
    )
    current_ids = {rel.plaga_id for rel in current}

    # Añadir nuevas relaciones
    for pid in final_ids - current_ids:
        db.add(TratamientoPlaga(tratamiento_id=tratamiento_id, plaga_id=pid))

    # Eliminar relaciones que ya no existan
    for rel in current:
        if rel.plaga_id not in final_ids:
            db.delete(rel)


# ---------------------------------------------------------
# Sincronizar enfermedades asociadas a un tratamiento
# ---------------------------------------------------------
def sync_tratamiento_enfermedades(db: Session, tratamiento_id: int, enfermedades_nombres: list[str]):
    enfermedades_nombres = [e.strip() for e in enfermedades_nombres if e.strip()]

    existing = db.query(Enfermedad).filter(Enfermedad.nombre.in_(enfermedades_nombres)).all()
    existing_names = {e.nombre for e in existing}

    for nombre in enfermedades_nombres:
        if nombre not in existing_names:
            nueva = Enfermedad(nombre=nombre)
            db.add(nueva)
            db.flush()
            existing.append(nueva)

    final_ids = {e.id for e in existing}

    current = (
        db.query(TratamientoEnfermedad)
        .filter(TratamientoEnfermedad.tratamiento_id == tratamiento_id)
        .all()
    )
    current_ids = {rel.enfermedad_id for rel in current}

    for eid in final_ids - current_ids:
        db.add(TratamientoEnfermedad(tratamiento_id=tratamiento_id, enfermedad_id=eid))

    for rel in current:
        if rel.enfermedad_id not in final_ids:
            db.delete(rel)
