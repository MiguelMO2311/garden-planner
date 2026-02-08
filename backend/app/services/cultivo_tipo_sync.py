from sqlalchemy.orm import Session

from app.models.plaga import Plaga
from app.models.enfermedad import Enfermedad
from app.models.cultivo_tipo_plaga import CultivoTipoPlaga


# ---------------------------------------------------------
# Sincronizar plagas (esto se mantiene igual)
# ---------------------------------------------------------
def sync_plagas(db: Session, cultivo_tipo_id: int, plagas_nombres: list[str]):
    plagas_nombres = [p.strip() for p in plagas_nombres if p.strip()]

    existing_plagas = (
        db.query(Plaga)
        .filter(Plaga.nombre.in_(plagas_nombres))
        .all()
    )

    existing_names = {p.nombre for p in existing_plagas}

    for nombre in plagas_nombres:
        if nombre not in existing_names:
            nueva = Plaga(nombre=nombre)
            db.add(nueva)
            db.flush()
            existing_plagas.append(nueva)

    final_ids = {p.id for p in existing_plagas}

    current_relations = (
        db.query(CultivoTipoPlaga)
        .filter(CultivoTipoPlaga.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    current_ids = {rel.plaga_id for rel in current_relations}

    for pid in final_ids - current_ids:
        db.add(CultivoTipoPlaga(cultivo_tipo_id=cultivo_tipo_id, plaga_id=pid))

    for rel in current_relations:
        if rel.plaga_id not in final_ids:
            db.delete(rel)


# ---------------------------------------------------------
# Sincronizar enfermedades (NUEVO MODELO)
# ---------------------------------------------------------
def sync_enfermedades(db: Session, cultivo_tipo_id: int, enfermedades_nombres: list[str]):
    # Normalizar nombres
    enfermedades_nombres = [e.strip() for e in enfermedades_nombres if e.strip()]

    # Obtener enfermedades existentes del catálogo
    existing_enfermedades = (
        db.query(Enfermedad)
        .filter(Enfermedad.nombre.in_(enfermedades_nombres))
        .all()
    )

    existing_names = {e.nombre for e in existing_enfermedades}

    # Crear las que no existan
    for nombre in enfermedades_nombres:
        if nombre not in existing_names:
            nueva = Enfermedad(
                nombre=nombre,
                cultivo_tipo_id=cultivo_tipo_id,   # ← ASOCIACIÓN DIRECTA AL CATÁLOGO
                cultivo_parcela_id=None
            )
            db.add(nueva)
            db.flush()
            existing_enfermedades.append(nueva)

    # Obtener IDs finales
    final_ids = {e.id for e in existing_enfermedades}

    # Obtener enfermedades actualmente asociadas al cultivo tipo
    current_relations = (
        db.query(Enfermedad)
        .filter(Enfermedad.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    current_ids = {e.id for e in current_relations}

    # Añadir nuevas asociaciones
    for eid in final_ids - current_ids:
        enfermedad = db.query(Enfermedad).get(eid)
        enfermedad.cultivo_tipo_id = cultivo_tipo_id

    # Eliminar asociaciones que ya no existan
    for e in current_relations:
        if e.id not in final_ids:
            e.cultivo_tipo_id = None
