from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.roles import require_role
from app.models.plot import Plot
from app.schemas.plot import PlotCreate, PlotRead

router = APIRouter(prefix="/plots", tags=["Plots"])


# -----------------------------
# CREATE PLOT (user)
# -----------------------------
@router.post("/", response_model=PlotRead)
def create_plot(
    plot: PlotCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_plot = Plot(**plot.model_dump(), user_id=user.id)
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot


# -----------------------------
# LIST PLOTS (user sees only their own)
# -----------------------------
@router.get("/", response_model=List[PlotRead])
def list_plots(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(Plot).filter(Plot.user_id == user.id).all()


# -----------------------------
# GET ONE PLOT (must belong to user)
# -----------------------------
@router.get("/{plot_id}", response_model=PlotRead)
def get_plot(
    plot_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    plot = db.query(Plot).filter(Plot.id == plot_id).first()

    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    if plot.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your plot")

    return plot


# -----------------------------
# DELETE PLOT (admin only)
# -----------------------------
@router.delete("/{plot_id}")
def delete_plot(
    plot_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_role("admin"))
):
    plot = db.query(Plot).filter(Plot.id == plot_id).first()

    if not plot:
        raise HTTPException(status_code=404, detail="Plot not found")

    db.delete(plot)
    db.commit()

    return {"message": "Plot deleted successfully"}
