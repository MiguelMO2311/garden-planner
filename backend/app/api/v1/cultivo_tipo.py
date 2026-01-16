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

# 🔥 Import correcto del servicio de sincronización
from app.services.cultivo_tipo_sync import sync_plagas, sync_enfermedades

router = APIRouter(tags=["Cultivos tipo"])


# ---------------------------------------------------------
# Crear cultivo tipo (CATÁLOGO)
# ---------------------------------------------------------
@router.post("/", response_model=CultivoTipoRead, status_code=status.HTTP_201_CREATED)
def create_cultivo_tipo(
    cultivo_in: CultivoTipoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = cultivo_in.model_dump()

    cultivo = CultivoTipo(
        **data,
        user_id=current_user.id
    )

    db.add(cultivo)
    db.commit()
    db.refresh(cultivo)

    # 🔥 Sincronizar plagas y enfermedades
    sync_plagas(db, cultivo.id, cultivo_in.plagas or [])
    sync_enfermedades(db, cultivo.id, cultivo_in.enfermedades or [])

    db.commit()
    db.refresh(cultivo)

    return cultivo


# ---------------------------------------------------------
# Listar cultivos tipo del usuario
# ---------------------------------------------------------
@router.get("/", response_model=List[CultivoTipoRead])
def list_cultivos_tipo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivos = (
        db.query(CultivoTipo)
        .filter(CultivoTipo.user_id == current_user.id)
        .order_by(CultivoTipo.nombre)
        .all()
    )

    return cultivos


# ---------------------------------------------------------
# Obtener cultivo tipo por ID
# ---------------------------------------------------------
@router.get("/{cultivo_id}", response_model=CultivoTipoRead)
def get_cultivo_tipo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_id,
            CultivoTipo.user_id == current_user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo tipo no encontrado"
        )

    return cultivo


# ---------------------------------------------------------
# Eliminar cultivo tipo
# ---------------------------------------------------------
@router.delete("/{cultivo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cultivo_tipo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_id,
            CultivoTipo.user_id == current_user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo tipo no encontrado"
        )

    db.delete(cultivo)
    db.commit()
    return None


# ---------------------------------------------------------
# Actualizar cultivo tipo
# ---------------------------------------------------------
@router.put("/{cultivo_id}", response_model=CultivoTipoRead)
def update_cultivo_tipo(
    cultivo_id: int,
    cultivo_in: CultivoTipoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_id,
            CultivoTipo.user_id == current_user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo tipo no encontrado"
        )

    data = cultivo_in.model_dump(exclude_unset=True)

    for field, value in data.items():
        setattr(cultivo, field, value)

    db.commit()
    db.refresh(cultivo)

    # 🔥 Sincronizar relaciones
    sync_plagas(db, cultivo.id, cultivo_in.plagas or [])
    sync_enfermedades(db, cultivo.id, cultivo_in.enfermedades or [])

    db.commit()
    db.refresh(cultivo)

    return cultivo

# ---------------------------------------------------------
# ENDPOINT: Obtener plagas reales asociadas a un cultivo tipo
# ---------------------------------------------------------
# Este endpoint devuelve las plagas REALES asociadas al cultivo tipo,
# usando la tabla intermedia cultivo_tipo_plaga.
# No rompe nada del sistema actual porque sigue existiendo el array JSON,
# pero ahora permite lógica avanzada (riesgos, alertas, tratamientos).
# ---------------------------------------------------------

@router.get("/{cultivo_id}/plagas", tags=["Cultivos tipo"])
def get_cultivo_plagas(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar que el cultivo pertenece al usuario
    cultivo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_id,
            CultivoTipo.user_id == current_user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    from app.models.cultivo_tipo_plaga import CultivoTipoPlaga
    from app.models.plaga import Plaga

    # Obtener plagas reales asociadas
    plagas = (
        db.query(Plaga)
        .join(CultivoTipoPlaga, Plaga.id == CultivoTipoPlaga.plaga_id)
        .filter(CultivoTipoPlaga.cultivo_tipo_id == cultivo_id)
        .order_by(Plaga.nombre)
        .all()
    )

    return plagas



# ---------------------------------------------------------
# ENDPOINT: Obtener enfermedades reales asociadas a un cultivo tipo
# ---------------------------------------------------------
# Este endpoint devuelve las enfermedades REALES asociadas al cultivo tipo,
# usando la tabla intermedia cultivo_tipo_enfermedad.
# Igual que el anterior, no rompe nada del sistema actual.
# ---------------------------------------------------------

@router.get("/{cultivo_id}/enfermedades", tags=["Cultivos tipo"])
def get_cultivo_enfermedades(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar que el cultivo pertenece al usuario
    cultivo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_id,
            CultivoTipo.user_id == current_user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no encontrado")

    from app.models.cultivo_tipo_enfermedad import CultivoTipoEnfermedad
    from app.models.enfermedad import Enfermedad

    # Obtener enfermedades reales asociadas
    enfermedades = (
        db.query(Enfermedad)
        .join(CultivoTipoEnfermedad, Enfermedad.id == CultivoTipoEnfermedad.enfermedad_id)
        .filter(CultivoTipoEnfermedad.cultivo_tipo_id == cultivo_id)
        .order_by(Enfermedad.nombre)
        .all()
    )

    return enfermedades
