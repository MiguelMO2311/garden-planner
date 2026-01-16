# app/api/v1/tratamientos.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.tratamiento_schema import (
    TratamientoCreate,
    TratamientoRead
)
from app.models.tratamiento import Tratamiento
from app.services.tratamiento_sync import (
    sync_tratamiento_plagas,
    sync_tratamiento_enfermedades
)

router = APIRouter(tags=["Tratamientos"])


# ---------------------------------------------------------
# Crear tratamiento
# ---------------------------------------------------------
@router.post("/", response_model=TratamientoRead)
def create_tratamiento(
    tratamiento_in: TratamientoCreate,
    db: Session = Depends(get_db)
):
    # Datos base del tratamiento (sin relaciones)
    data = tratamiento_in.model_dump(
        exclude={"plagas", "enfermedades"}
    )

    tratamiento = Tratamiento(**data)
    db.add(tratamiento)
    db.commit()
    db.refresh(tratamiento)

    # Sincronizar relaciones con plagas y enfermedades
    sync_tratamiento_plagas(db, tratamiento.id, tratamiento_in.plagas)
    sync_tratamiento_enfermedades(db, tratamiento.id, tratamiento_in.enfermedades)

    db.commit()
    db.refresh(tratamiento)

    return tratamiento


# ---------------------------------------------------------
# Listar tratamientos
# ---------------------------------------------------------
@router.get("/", response_model=List[TratamientoRead])
def list_tratamientos(db: Session = Depends(get_db)):
    return (
        db.query(Tratamiento)
        .order_by(Tratamiento.nombre)
        .all()
    )


# ---------------------------------------------------------
# Obtener tratamiento por ID
# ---------------------------------------------------------
@router.get("/{tratamiento_id}", response_model=TratamientoRead)
def get_tratamiento(
    tratamiento_id: int,
    db: Session = Depends(get_db)
):
    tratamiento = (
        db.query(Tratamiento)
        .filter(Tratamiento.id == tratamiento_id)
        .first()
    )

    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")

    return tratamiento


# ---------------------------------------------------------
# Eliminar tratamiento
# ---------------------------------------------------------
@router.delete("/{tratamiento_id}", status_code=204)
def delete_tratamiento(
    tratamiento_id: int,
    db: Session = Depends(get_db)
):
    tratamiento = (
        db.query(Tratamiento)
        .filter(Tratamiento.id == tratamiento_id)
        .first()
    )

    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")

    db.delete(tratamiento)
    db.commit()
    return None
