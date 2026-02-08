# app/api/v1/cultivo_tipo.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.models.cultivo_tipo import CultivoTipo
from app.schemas.cultivo_tipo_schema import (
    CultivoTipoCreate,
    CultivoTipoRead,
    CultivoTipoUpdate
)

from app.services.cultivo_tipo_sync import sync_plagas, sync_enfermedades

router = APIRouter(tags=["Cultivos tipo"])


# ---------------------------------------------------------
# Crear cultivo tipo (CATÁLOGO GLOBAL)
# ---------------------------------------------------------
@router.post("/", response_model=CultivoTipoRead, status_code=status.HTTP_201_CREATED)
def create_cultivo_tipo(
    cultivo_in: CultivoTipoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Los cultivos tipo son globales → no llevan user_id
    cultivo = CultivoTipo(**cultivo_in.model_dump())

    db.add(cultivo)
    db.commit()
    db.refresh(cultivo)

    # Sincronizar relaciones
    sync_plagas(db, cultivo.id, cultivo_in.plagas or [])
    sync_enfermedades(db, cultivo.id, cultivo_in.enfermedades or [])

    db.commit()
    db.refresh(cultivo)

    return cultivo


# ---------------------------------------------------------
# Listar TODOS los cultivos tipo (CATÁLOGO GLOBAL)
# ---------------------------------------------------------
@router.get("/", response_model=List[CultivoTipoRead])
def list_cultivos_tipo(db: Session = Depends(get_db)):
    return (
        db.query(CultivoTipo)
        .order_by(CultivoTipo.nombre)
        .all()
    )


# ---------------------------------------------------------
# Obtener cultivo tipo por ID (GLOBAL)
# ---------------------------------------------------------
@router.get("/{cultivo_id}", response_model=CultivoTipoRead)
def get_cultivo_tipo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(CultivoTipo).filter(CultivoTipo.id == cultivo_id).first()

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    return cultivo


# ---------------------------------------------------------
# Eliminar cultivo tipo (GLOBAL)
# ---------------------------------------------------------
@router.delete("/{cultivo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cultivo_tipo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(CultivoTipo).filter(CultivoTipo.id == cultivo_id).first()

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    db.delete(cultivo)
    db.commit()
    return None


# ---------------------------------------------------------
# Actualizar cultivo tipo (GLOBAL)
# ---------------------------------------------------------
@router.put("/{cultivo_id}", response_model=CultivoTipoRead)
def update_cultivo_tipo(
    cultivo_id: int,
    cultivo_in: CultivoTipoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(CultivoTipo).filter(CultivoTipo.id == cultivo_id).first()

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    data = cultivo_in.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(cultivo, field, value)

    db.commit()
    db.refresh(cultivo)

    # Sincronizar relaciones
    sync_plagas(db, cultivo.id, cultivo_in.plagas or [])
    sync_enfermedades(db, cultivo.id, cultivo_in.enfermedades or [])

    db.commit()
    db.refresh(cultivo)

    return cultivo


# ---------------------------------------------------------
# Obtener plagas reales asociadas a un cultivo tipo
# ---------------------------------------------------------
@router.get("/{cultivo_id}/plagas")
def get_cultivo_plagas(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cultivo = db.query(CultivoTipo).filter(CultivoTipo.id == cultivo_id).first()

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    from app.models.cultivo_tipo_plaga import CultivoTipoPlaga
    from app.models.plaga import Plaga

    return (
        db.query(Plaga)
        .join(CultivoTipoPlaga, Plaga.id == CultivoTipoPlaga.plaga_id)
        .filter(CultivoTipoPlaga.cultivo_tipo_id == cultivo_id)
        .order_by(Plaga.nombre)
        .all()
    )


# ---------------------------------------------------------
# Obtener enfermedades reales asociadas a un cultivo tipo
# ---------------------------------------------------------
@router.get("/{cultivo_id}/enfermedades")
def get_cultivo_enfermedades(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cultivo = db.query(CultivoTipo).filter(CultivoTipo.id == cultivo_id).first()

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    from app.models.cultivo_tipo_enfermedad import CultivoTipoEnfermedad
    from app.models.enfermedad import Enfermedad

    return (
        db.query(Enfermedad)
        .join(CultivoTipoEnfermedad, Enfermedad.id == CultivoTipoEnfermedad.enfermedad_id)
        .filter(CultivoTipoEnfermedad.cultivo_tipo_id == cultivo_id)
        .order_by(Enfermedad.nombre)
        .all()
    )