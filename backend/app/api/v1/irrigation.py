from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.irrigation import Irrigation
from app.schemas.irrigation import IrrigationCreate, IrrigationRead

router = APIRouter(prefix="/irrigation", tags=["Irrigation"])


# CREATE (user)
@router.post("/", response_model=IrrigationRead)
def create_irrigation(
    irrigation: IrrigationCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_irrigation = Irrigation(**irrigation.dict(), user_id=user.id)
    db.add(db_irrigation)
    db.commit()
    db.refresh(db_irrigation)
    return db_irrigation


# LIST (user sees only their own)
@router.get("/", response_model=List[IrrigationRead])
def list_irrigations(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(Irrigation).filter(Irrigation.user_id == user.id).all()


# GET ONE
@router.get("/{irrigation_id}", response_model=IrrigationRead)
def get_irrigation(
    irrigation_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    irrigation = db.query(Irrigation).filter(Irrigation.id == irrigation_id).first()

    if not irrigation:
        raise HTTPException(status_code=404, detail="Irrigation record not found")

    if irrigation.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your irrigation record")

    return irrigation


# DELETE (admin only)
@router.delete("/{irrigation_id}")
def delete_irrigation(
    irrigation_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    irrigation = db.query(Irrigation).filter(Irrigation.id == irrigation_id).first()

    if not irrigation:
        raise HTTPException(status_code=404, detail="Irrigation record not found")

    db.delete(irrigation)
    db.commit()

    return {"message": "Irrigation record deleted successfully"}
