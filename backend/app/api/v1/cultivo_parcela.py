from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import timedelta

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.cultivo_parcela import CultivoParcela
from app.models.cultivo_tipo import CultivoTipo
from app.models.plot import Plot

from app.schemas.cultivo_parcela_schema import (
    CultivoParcelaCreate,
    CultivoParcelaUpdate,
    CultivoParcelaRead,
)

router = APIRouter(tags=["Cultivos en parcela"])


# ---------------------------------------------------------
# LISTAR CULTIVOS EN PARCELA
# ---------------------------------------------------------
@router.get("/", response_model=List[CultivoParcelaRead])
def list_cultivo_parcela(
    parcela_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(CultivoParcela)
        .options(
            joinedload(CultivoParcela.cultivo_tipo),
            joinedload(CultivoParcela.parcela)
        )
        .join(Plot)
        .filter(Plot.user_id == current_user.id)
    )

    if parcela_id is not None:
        query = query.filter(CultivoParcela.parcela_id == parcela_id)

    return query.all()

# ---------------------------------------------------------
# OBTENER CULTIVO EN PARCELA POR ID
# ---------------------------------------------------------
@router.get("/{cultivo_parcela_id}", response_model=CultivoParcelaRead)
def get_cultivo_parcela(
    cultivo_parcela_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = (
        db.query(CultivoParcela)
        .options(
            joinedload(CultivoParcela.cultivo_tipo),
            joinedload(CultivoParcela.parcela)
        )
        .join(Plot)
        .filter(
            CultivoParcela.id == cultivo_parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(status_code=404, detail="Cultivo no encontrado")

    return cultivo


# ---------------------------------------------------------
# CREAR CULTIVO EN PARCELA
# ---------------------------------------------------------
@router.post("/", response_model=CultivoParcelaRead, status_code=status.HTTP_201_CREATED)
def create_cultivo_parcela(
    cultivo_in: CultivoParcelaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo_tipo = (
        db.query(CultivoTipo)
        .filter(
            CultivoTipo.id == cultivo_in.cultivo_tipo_id,
            CultivoTipo.user_id == current_user.id,
        )
        .first()
    )
    if not cultivo_tipo:
        raise HTTPException(status_code=404, detail="Cultivo tipo no válido")

    parcela = (
        db.query(Plot)
        .filter(
            Plot.id == cultivo_in.parcela_id,
            Plot.user_id == current_user.id,
        )
        .first()
    )
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no válida")

    # Calcular fecha de cosecha
    fecha_cosecha = None
    if cultivo_in.fecha_siembra and cultivo_tipo.dias_crecimiento:
        fecha_cosecha = cultivo_in.fecha_siembra + timedelta(days=cultivo_tipo.dias_crecimiento)

    cultivo = CultivoParcela(
        **cultivo_in.model_dump(),
        fecha_cosecha=fecha_cosecha,
        user_id=current_user.id
    )

    db.add(cultivo)
    db.commit()
    db.refresh(cultivo)

    # 🔥 Recargar con relaciones para que el schema pueda serializarlo
    cultivo = (
        db.query(CultivoParcela)
        .options(
            joinedload(CultivoParcela.cultivo_tipo),
            joinedload(CultivoParcela.parcela)
        )
        .filter(CultivoParcela.id == cultivo.id)
        .first()
    )

    return cultivo


# ---------------------------------------------------------
# ACTUALIZAR CULTIVO EN PARCELA
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
        raise HTTPException(status_code=404, detail="Cultivo no encontrado")

    data = cultivo_in.model_dump(exclude_unset=True)

    # Validaciones
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
            raise HTTPException(status_code=404, detail="Cultivo tipo no válido")

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
            raise HTTPException(status_code=404, detail="Parcela no válida")

    # Aplicar cambios
    for field, value in data.items():
        setattr(cultivo, field, value)

    # Recalcular fecha de cosecha
    cultivo_tipo_actual = db.query(CultivoTipo).filter(
        CultivoTipo.id == cultivo.cultivo_tipo_id
    ).first()

    if cultivo.fecha_siembra and cultivo_tipo_actual.dias_crecimiento:
        cultivo.fecha_cosecha = cultivo.fecha_siembra + timedelta(days=cultivo_tipo_actual.dias_crecimiento)

    db.commit()
    db.refresh(cultivo)

    # 🔥 Recargar con relaciones
    cultivo = (
        db.query(CultivoParcela)
        .options(
            joinedload(CultivoParcela.cultivo_tipo),
            joinedload(CultivoParcela.parcela)
        )
        .filter(CultivoParcela.id == cultivo.id)
        .first()
    )

    return cultivo


# ---------------------------------------------------------
# ELIMINAR CULTIVO EN PARCELA
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
        raise HTTPException(status_code=404, detail="Cultivo no encontrado")

    db.delete(cultivo)
    db.commit()
    return None
