from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.pest import Pest
from app.schemas.pest import PestCreate, PestRead

router = APIRouter(prefix="/pests", tags=["Pests"])


# CREATE (user)
@router.post("/", response_model=PestRead)
def create_pest(
    pest: PestCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_pest = Pest(**pest.dict(), user_id=user.id)
    db.add(db_pest)
    db.commit()
    db.refresh(db_pest)
    return db_pest


# LIST (user sees only their own)
@router.get("/", response_model=List[PestRead])
def list_pests(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(Pest).filter(Pest.user_id == user.id).all()


# GET ONE (must belong to user)
@router.get("/{pest_id}", response_model=PestRead)
def get_pest(
    pest_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    pest = db.query(Pest).filter(Pest.id == pest_id).first()

    if not pest:
        raise HTTPException(status_code=404, detail="Pest not found")

    if pest.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your pest record")

    return pest


# DELETE (admin only)
@router.delete("/{pest_id}")
def delete_pest(
    pest_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    # Solo admin puede borrar
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    pest = db.query(Pest).filter(Pest.id == pest_id).first()

    if not pest:
        raise HTTPException(status_code=404, detail="Pest not found")

    db.delete(pest)
    db.commit()

    return {"message": "Pest deleted successfully"}
