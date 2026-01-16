from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.plaga import Plaga
from app.schemas.plaga_schema import PlagaRead

router = APIRouter(tags=["Plagas"])

@router.get("/", response_model=List[PlagaRead])
def list_plagas(db: Session = Depends(get_db)):
    return db.query(Plaga).order_by(Plaga.nombre).all()
