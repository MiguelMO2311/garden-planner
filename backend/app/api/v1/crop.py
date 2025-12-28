from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.cultivo import Cultivo
from app.schemas.cultivo import CultivoCreate, CultivoRead

router = APIRouter(prefix="/crops", tags=["Crops"])

@router.post("/", response_model=CultivoRead)
def create_crop(
    crop: CultivoCreate,
    db: Session = Depends(get_db)
):
    db_crop = Cultivo(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.get("/", response_model=List[CultivoRead])
def list_crops(db: Session = Depends(get_db)):
    return db.query(Cultivo).all()

@router.get("/{crop_id}", response_model=CultivoRead)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Cultivo).filter(Cultivo.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.delete("/{crop_id}")
def delete_crop(
    crop_id: int,
    db: Session = Depends(get_db)
):
    crop = db.query(Cultivo).filter(Cultivo.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    db.delete(crop)
    db.commit()

    return {"message": "Crop deleted successfully"}
