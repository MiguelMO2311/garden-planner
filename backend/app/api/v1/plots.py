# app/api/v1/plots.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.plot import Plot
from app.schemas.plot import PlotCreate, PlotRead, PlotUpdate
from app.models.user import User

router = APIRouter(tags=["Plots"])

# -------------------------
# CREATE
# -------------------------
@router.post("/", response_model=PlotRead, status_code=201)
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


# -------------------------
# READ (LIST)
# -------------------------
@router.get("/", response_model=List[PlotRead])
def list_plots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Plot).filter(Plot.user_id == current_user.id).all()


# -------------------------
# READ (DETAIL)
# -------------------------
@router.get("/{plot_id}", response_model=PlotRead)
def get_plot(
    plot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = db.query(Plot).filter(
        Plot.id == plot_id,
        Plot.user_id == current_user.id
    ).first()

    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    return plot


# -------------------------
# UPDATE
# -------------------------
@router.put("/{plot_id}", response_model=PlotRead)
def update_plot(
    plot_id: int,
    plot_in: PlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = db.query(Plot).filter(
        Plot.id == plot_id,
        Plot.user_id == current_user.id
    ).first()

    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    for field, value in plot_in.model_dump(exclude_unset=True).items():
        setattr(plot, field, value)

    db.commit()
    db.refresh(plot)
    return plot


# -------------------------
# DELETE
# -------------------------
@router.delete("/{plot_id}", status_code=204)
def delete_plot(
    plot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plot = db.query(Plot).filter(
        Plot.id == plot_id,
        Plot.user_id == current_user.id
    ).first()

    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    db.delete(plot)
    db.commit()
    return
