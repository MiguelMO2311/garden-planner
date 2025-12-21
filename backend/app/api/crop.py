from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.roles import require_role
from app.core.database import get_db
from app.models.crop import Crop
from app.schemas.crop import CropCreate, CropRead

router = APIRouter(prefix="/crops", tags=["Crops"])


# -----------------------------
# CREATE CROP (admin only)
# -----------------------------
@router.post("/", response_model=CropRead)
def create_crop(
    crop: CropCreate,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    db_crop = Crop(**crop.model_dump())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop


# -----------------------------
# LIST ALL CROPS (public)
# -----------------------------
@router.get("/", response_model=List[CropRead])
def list_crops(db: Session = Depends(get_db)):
    return db.query(Crop).all()


# -----------------------------
# GET ONE CROP (public)
# -----------------------------
@router.get("/{crop_id}", response_model=CropRead)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop


# -----------------------------
# DELETE CROP (admin only)
# -----------------------------
@router.delete("/{crop_id}")
def delete_crop(
    crop_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    db.delete(crop)
    db.commit()

    return {"message": "Crop deleted successfully"}
