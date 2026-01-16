from sqlalchemy.orm import Session

from app.models.plaga import Plaga
from app.models.enfermedad import Enfermedad
from app.models.cultivo_tipo_plaga import CultivoTipoPlaga
from app.models.cultivo_tipo_enfermedad import CultivoTipoEnfermedad


# ---------------------------------------------------------
# Sincronizar plagas
# ---------------------------------------------------------
def sync_plagas(db: Session, cultivo_tipo_id: int, plagas_nombres: list[str]):
    # Normalizar nombres
    plagas_nombres = [p.strip() for p in plagas_nombres if p.strip()]

    # Obtener plagas existentes
    existing_plagas = (
        db.query(Plaga)
        .filter(Plaga.nombre.in_(plagas_nombres))
        .all()
    )

    # Crear las que no existan
    existing_names = {p.nombre for p in existing_plagas}

    for nombre in plagas_nombres:
        if nombre not in existing_names:
            nueva = Plaga(nombre=nombre)
            db.add(nueva)
            db.flush()  # obtener ID sin commit
            existing_plagas.append(nueva)

    # IDs finales
    final_ids = {p.id for p in existing_plagas}

    # Obtener relaciones actuales
    current_relations = (
        db.query(CultivoTipoPlaga)
        .filter(CultivoTipoPlaga.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    current_ids = {rel.plaga_id for rel in current_relations}

    # Añadir nuevas relaciones
    for pid in final_ids - current_ids:
        db.add(CultivoTipoPlaga(cultivo_tipo_id=cultivo_tipo_id, plaga_id=pid))

    # Eliminar relaciones que ya no existan
    for rel in current_relations:
        if rel.plaga_id not in final_ids:
            db.delete(rel)


# ---------------------------------------------------------
# Sincronizar enfermedades
# ---------------------------------------------------------
def sync_enfermedades(db: Session, cultivo_tipo_id: int, enfermedades_nombres: list[str]):
    enfermedades_nombres = [e.strip() for e in enfermedades_nombres if e.strip()]

    existing_enfermedades = (
        db.query(Enfermedad)
        .filter(Enfermedad.nombre.in_(enfermedades_nombres))
        .all()
    )

    existing_names = {e.nombre for e in existing_enfermedades}

    for nombre in enfermedades_nombres:
        if nombre not in existing_names:
            nueva = Enfermedad(nombre=nombre)
            db.add(nueva)
            db.flush()
            existing_enfermedades.append(nueva)

    final_ids = {e.id for e in existing_enfermedades}

    current_relations = (
        db.query(CultivoTipoEnfermedad)
        .filter(CultivoTipoEnfermedad.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    current_ids = {rel.enfermedad_id for rel in current_relations}

    for eid in final_ids - current_ids:
        db.add(CultivoTipoEnfermedad(cultivo_tipo_id=cultivo_tipo_id, enfermedad_id=eid))

    for rel in current_relations:
        if rel.enfermedad_id not in final_ids:
            db.delete(rel)
