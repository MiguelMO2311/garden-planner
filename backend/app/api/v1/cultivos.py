import inspect
print(">>> CULTIVOS.PY CARGADO DESDE:", inspect.getfile(inspect.currentframe()))


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.cultivo import Cultivo
from app.schemas.cultivo import CultivoCreate, CultivoRead, CultivoUpdate
from app.models.plot import Plot

router = APIRouter(tags=["Cultivos"])

@router.post("/", response_model=CultivoRead)
def create_cultivo(
    cultivo_in: CultivoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verificar que la parcela existe y pertenece al usuario
    plot = db.query(Plot).filter(
        Plot.id == cultivo_in.plot_id,
        Plot.user_id == current_user.id
    ).first()

    if not plot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La parcela no existe o no pertenece al usuario"
        )

    cultivo = Cultivo(
        **cultivo_in.model_dump(),
        user_id=current_user.id
    )

    db.add(cultivo)
    db.commit()
    db.refresh(cultivo)
    return cultivo


@router.get("/", response_model=List[CultivoRead])
def list_cultivos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Cultivo).filter(Cultivo.user_id == current_user.id).all()


@router.get("/{cultivo_id}", response_model=CultivoRead)
def get_cultivo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(Cultivo).filter(
        Cultivo.id == cultivo_id,
        Cultivo.user_id == current_user.id
    ).first()

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )

    return cultivo


@router.delete("/{cultivo_id}")
def delete_cultivo(
    cultivo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(Cultivo).filter(
        Cultivo.id == cultivo_id,
        Cultivo.user_id == current_user.id
    ).first()

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )

    db.delete(cultivo)
    db.commit()
    return {"message": "Cultivo eliminado correctamente"}
@router.put("/{cultivo_id}", response_model=CultivoRead)
def update_cultivo(
    cultivo_id: int,
    cultivo_in: CultivoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cultivo = db.query(Cultivo).filter(
        Cultivo.id == cultivo_id,
        Cultivo.user_id == current_user.id
    ).first()

    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )

    # Si se cambia de parcela, validar que pertenece al usuario
    if cultivo_in.plot_id is not None:
        plot = db.query(Plot).filter(
            Plot.id == cultivo_in.plot_id,
            Plot.user_id == current_user.id
        ).first()
        if not plot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La nueva parcela no existe o no pertenece al usuario"
            )

    for field, value in cultivo_in.model_dump(exclude_unset=True).items():
        setattr(cultivo, field, value)

    db.commit()
    db.refresh(cultivo)
    return cultivo
