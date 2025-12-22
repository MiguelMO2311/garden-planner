# app/api/v1/plots.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.plot import Plot
from app.schemas.plot import PlotCreate, PlotRead
from app.models.user import User

router = APIRouter(prefix="/plots", tags=["Plots"])


@router.post("/", response_model=PlotRead)
def create_plot(
    plot_in: PlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_plot = Plot(**plot_in.model_dump(), user_id=current_user.id)
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot


@router.get("/", response_model=List[PlotRead])
def list_plots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Plot).filter(Plot.user_id == current_user.id).all()
