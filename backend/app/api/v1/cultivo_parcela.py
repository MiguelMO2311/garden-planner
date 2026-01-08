# app/api/v1/cultivo_parcela.py
import inspect
print(">>> CULTIVO_PARCELA.PY CARGADO DESDE:", inspect.getfile(inspect.currentframe()))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.models.cultivo_parcela import CultivoParcela
from app.models.cultivo_tipo import CultivoTipo
from app.models.plot import Plot

from app.schemas.cultivo_parcela import (
    CultivoParcelaCreate,
    CultivoParcelaUpdate,
    CultivoParcelaRead,
)

router = APIRouter(
    tags=["Cultivos en parcela"]
)

# ---------------------------------------------------------
# LISTAR cultivos plantados (opcionalmente por parcela)
# ---------------------------------------------------------
@router.get("/", response_model=List[CultivoParcelaRead])
def list_cultivo_parcela(
    parcela_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(CultivoParcela)
        .join(Plot)
        .filter(Plot.user_id == current_user.id)
    )

    if parcela_id is not None:
        query = query.filter(CultivoParcela.parcela_id == parcela_id)

    return query.all()


# ---------------------------------------------------------
# CREAR cultivo plantado en una parcela
# ---------------------------------------------------------
@router.post("/", response_model=CultivoParcelaRead, status_code=status.HTTP_201_CREATED)
def create_cultivo_parcela(
    cultivo_in: CultivoParcelaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validar cultivo tipo
    cultivo_tipo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_in.cultivo_tipo_id,
            CultivoTipo.user_id == current_user.id,
        )
        .first()
    )
    if not cultivo_tipo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo tipo no encontrado o no pertenece al usuario",
        )

    # Validar parcela
    parcela = (
        db.query(Plot)
        .filter(
            Plot.id == cultivo_in.parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )
    if not parcela:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La parcela no existe o no pertenece al usuario",
        )

    cultivo = CultivoParcela(**cultivo_in.model_dump())
    db.add(cultivo)
    db.commit()
    db.refresh(cultivo)
    return cultivo


# ---------------------------------------------------------
# OBTENER cultivo plantado por ID
# ---------------------------------------------------------
@router.get("/{cultivo_parcela_id}", response_model=CultivoParcelaRead)
def get_cultivo_parcela(
    cultivo_parcela_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoParcela)
        .join(Plot)
        .filter(
            CultivoParcela.id == cultivo_parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo en parcela no encontrado",
        )

    return cultivo


# ---------------------------------------------------------
# ACTUALIZAR cultivo plantado
# ---------------------------------------------------------
@router.put("/{cultivo_parcela_id}", response_model=CultivoParcelaRead)
def update_cultivo_parcela(
    cultivo_parcela_id: int,
    cultivo_in: CultivoParcelaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoParcela)
        .join(Plot)
        .filter(
            CultivoParcela.id == cultivo_parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo en parcela no encontrado",
        )

    data = cultivo_in.model_dump(exclude_unset=True)

    # Validar cambios de cultivo_tipo_id
    if "cultivo_tipo_id" in data:
        cultivo_tipo = (
            db.query(CultivoTipo)
            .filter(
                CultivoTipo.id == data["cultivo_tipo_id"],
                CultivoTipo.user_id == current_user.id,
            )
            .first()
        )
        if not cultivo_tipo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cultivo tipo no encontrado o no pertenece al usuario",
            )

    # Validar cambios de parcela_id
    if "parcela_id" in data:
        parcela = (
            db.query(Plot)
            .filter(
                Plot.id == data["parcela_id"],
                Plot.user_id == current_user.id,
            )
            .first()
        )
        if not parcela:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La parcela no existe o no pertenece al usuario",
            )

    for field, value in data.items():
        setattr(cultivo, field, value)

    db.commit()
    db.refresh(cultivo)
    return cultivo


# ---------------------------------------------------------
# ELIMINAR cultivo plantado
# ---------------------------------------------------------
@router.delete("/{cultivo_parcela_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cultivo_parcela(
    cultivo_parcela_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoParcela)
        .join(Plot)
        .filter(
            CultivoParcela.id == cultivo_parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo en parcela no encontrado",
        )

    db.delete(cultivo)
    db.commit()
    return None
