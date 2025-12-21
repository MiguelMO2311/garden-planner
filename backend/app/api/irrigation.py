from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.roles import require_role
from app.models.irrigation import IrrigationLog
from app.schemas.irrigation import IrrigationCreate, IrrigationRead

router = APIRouter(prefix="/irrigation", tags=["Irrigation Logs"])


# CREATE (user)
@router.post("/", response_model=IrrigationRead)
def create_irrigation(
    irrigation: IrrigationCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_log = IrrigationLog(**irrigation.model_dump(), user_id=user.id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


# LIST (user sees only their own)
@router.get("/", response_model=List[IrrigationRead])
def list_irrigation(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(IrrigationLog).filter(IrrigationLog.user_id == user.id).all()


# GET ONE (must belong to user)
@router.get("/{log_id}", response_model=IrrigationRead)
def get_irrigation(
    log_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    log = db.query(IrrigationLog).filter(IrrigationLog.id == log_id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Irrigation log not found")

    if log.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your irrigation log")

    return log


# DELETE (admin only)
@router.delete("/{log_id}")
def delete_irrigation(
    log_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    log = db.query(IrrigationLog).filter(IrrigationLog.id == log_id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Irrigation log not found")

    db.delete(log)
    db.commit()

    return {"message": "Irrigation log deleted successfully"}
