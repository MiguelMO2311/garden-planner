from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

from pydantic import BaseModel

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.plot import Plot
from app.models.cultivo_plan import CultivoPlan
from app.models.irrigation import Irrigation
from app.models.pest import Pest
from app.models.cultivo_parcela import CultivoParcela   # ← IMPORTANTE

router = APIRouter(tags=["Dashboard"])

class DashboardStats(BaseModel):
    plots_count: int
    cultivos_count: int
    crop_plans_active: int
    irrigations_last_7_days: int
    pests_last_30_days: int


@router.get("/", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    today = date.today()
    seven_days_ago = today - timedelta(days=7)
    thirty_days_ago = today - timedelta(days=30)

    # Filtro base según rol
    if user.role == "admin":
        plots_q = db.query(Plot)
        plans_q = db.query(CultivoPlan)
        irrigation_q = db.query(Irrigation)
        pests_q = db.query(Pest)
        cultivos_parcela_q = db.query(CultivoParcela)   # ← NUEVO
    else:
        plots_q = db.query(Plot).filter(Plot.user_id == user.id)
        plans_q = db.query(CultivoPlan).filter(CultivoPlan.user_id == user.id)
        irrigation_q = db.query(Irrigation).filter(Irrigation.user_id == user.id)
        pests_q = db.query(Pest).filter(Pest.user_id == user.id)
        cultivos_parcela_q = db.query(CultivoParcela).filter(CultivoParcela.user_id == user.id)  # ← NUEVO

    # Número de parcelas
    plots_count = plots_q.count()

    # Número total de cultivos reales en parcela
    cultivos_count = cultivos_parcela_q.count()   # ← CORREGIDO

    # Planes activos (start_date <= hoy <= end_date o sin end_date)
    crop_plans_active = plans_q.filter(
        CultivoPlan.start_date <= today,
        (CultivoPlan.end_date == None) | (CultivoPlan.end_date >= today),
    ).count()

    # Riegos últimos 7 días
    irrigations_last_7_days = irrigation_q.filter(
        Irrigation.date >= seven_days_ago,
        Irrigation.date <= today,
    ).count()

    # Plagas últimos 30 días
    pests_last_30_days = pests_q.filter(
        Pest.date_detected >= thirty_days_ago,
        Pest.date_detected <= today,
    ).count()

    return DashboardStats(
        plots_count=plots_count,
        cultivos_count=cultivos_count,
        crop_plans_active=crop_plans_active,
        irrigations_last_7_days=irrigations_last_7_days,
        pests_last_30_days=pests_last_30_days,
    )
