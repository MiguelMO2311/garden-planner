from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.auth import get_current_user

from app.core.database import get_db
from app.models.cultivo_tipo import CultivoTipo
from backend.app.schemas.cultivo_tipo_schema import CultivoTipoCreate, CultivoTipoRead

router = APIRouter(prefix="/crops", tags=["Crops"])

@router.post("/", response_model=CultivoTipoRead)
def create_crop(
    crop: CultivoTipoCreate,
    db: Session = Depends(get_db)
):
    db_crop = CultivoTipo(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.get("/", response_model=List[CultivoTipoRead])
def list_crops(db: Session = Depends(get_db)):
    return db.query(CultivoTipo).all()

@router.get("/{crop_id}", response_model=CultivoTipoRead)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(CultivoTipo).filter(CultivoTipo.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@router.delete("/{crop_id}")
def delete_crop(
    crop_id: int,
    db: Session = Depends(get_db)
):
    crop = db.query(CultivoTipo).filter(CultivoTipo.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    db.delete(crop)
    db.commit()

    return {"message": "Crop deleted successfully"}
