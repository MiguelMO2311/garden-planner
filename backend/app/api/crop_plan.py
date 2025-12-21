from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.roles import require_role
from app.models.crop_plan import CropPlan
from app.schemas.crop_plan import CropPlanCreate, CropPlanRead

router = APIRouter(prefix="/crop-plans", tags=["Crop Plans"])


# CREATE (user)
@router.post("/", response_model=CropPlanRead)
def create_crop_plan(
    plan: CropPlanCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_plan = CropPlan(**plan.model_dump(), user_id=user.id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


# LIST (user sees only their own)
@router.get("/", response_model=List[CropPlanRead])
def list_crop_plans(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(CropPlan).filter(CropPlan.user_id == user.id).all()


# GET ONE (must belong to user)
@router.get("/{plan_id}", response_model=CropPlanRead)
def get_crop_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    plan = db.query(CropPlan).filter(CropPlan.id == plan_id).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Crop plan not found")

    if plan.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your crop plan")

    return plan


# DELETE (admin only)
@router.delete("/{plan_id}")
def delete_crop_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    plan = db.query(CropPlan).filter(CropPlan.id == plan_id).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Crop plan not found")

    db.delete(plan)
    db.commit()

    return {"message": "Crop plan deleted successfully"}
