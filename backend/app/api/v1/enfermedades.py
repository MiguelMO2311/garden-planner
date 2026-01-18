from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.auth import get_current_user

from app.core.database import get_db
from app.models.enfermedad import Enfermedad
from app.schemas.enfermedad_schema import EnfermedadRead

router = APIRouter(tags=["Enfermedades"])

@router.get("/", response_model=List[EnfermedadRead])
def list_enfermedades(db: Session = Depends(get_db)):
    return db.query(Enfermedad).order_by(Enfermedad.nombre).all()
