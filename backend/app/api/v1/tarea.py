from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.tarea import Tarea
from app.schemas.tarea import TareaCreate, TareaRead

router = APIRouter(prefix="/tareas", tags=["Tareas"])

@router.post("/", response_model=TareaRead)
def create_tarea(tarea: TareaCreate, db: Session = Depends(get_db)):
    db_tarea = Tarea(**tarea.dict())
    db.add(db_tarea)
    db.commit()
    db.refresh(db_tarea)
    return db_tarea

@router.get("/", response_model=List[TareaRead])
def get_tareas(db: Session = Depends(get_db)):
    return db.query(Tarea).all()
