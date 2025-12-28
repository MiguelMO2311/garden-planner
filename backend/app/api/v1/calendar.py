from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.cultivo_plan import CultivoPlan
from app.models.irrigation import Irrigation
from app.models.pest import Pest
from pydantic import BaseModel


router = APIRouter(prefix="/calendar", tags=["Calendar"])


class CalendarEvent(BaseModel):
    date: date
    type: str  # "crop_plan", "irrigation", "pest"
    title: str
    description: str | None = None
    related_id: int | None = None


@router.get("/", response_model=List[CalendarEvent])
def get_calendar(
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    # Rango por defecto: hoy ±30 días
    today = date.today()
    if start_date is None:
        start_date = today
    if end_date is None:
        end_date = today.replace(year=today.year + 1)

    events: list[CalendarEvent] = []

    # --- Crop Plans (usar start_date y end_date del plan) ---
    q_plans = db.query(CultivoPlan)
    if user.role != "admin":
        q_plans = q_plans.filter(CultivoPlan.user_id == user.id)
    plans = q_plans.all()

    for plan in plans:
        # evento de inicio
        if plan.start_date >= start_date and plan.start_date <= end_date:
            events.append(
                CalendarEvent(
                    date=plan.start_date,
                    type="crop_plan",
                    title=f"Inicio plan cultivo #{plan.id}",
                    description=plan.notes,
                    related_id=plan.id,
                )
            )
        # evento de fin (si existe)
        if plan.end_date and plan.end_date >= start_date and plan.end_date <= end_date:
            events.append(
                CalendarEvent(
                    date=plan.end_date,
                    type="crop_plan",
                    title=f"Fin plan cultivo #{plan.id}",
                    description=plan.notes,
                    related_id=plan.id,
                )
            )

    # --- Riegos ---
    q_irrigation = db.query(Irrigation).filter(
        Irrigation.date >= start_date,
        Irrigation.date <= end_date,
    )
    if user.role != "admin":
        q_irrigation = q_irrigation.filter(Irrigation.user_id == user.id)
    irrigations = q_irrigation.all()

    for log in irrigations:
        events.append(
            CalendarEvent(
                date=log.date,
                type="irrigation",
                title=f"Riego parcela #{log.plot_id}",
                description=f"{log.liters} L",
                related_id=log.id,
            )
        )

    # --- Plagas ---
    q_pests = db.query(Pest).filter(
        Pest.date_detected >= start_date,
        Pest.date_detected <= end_date,
    )
    if user.role != "admin":
        q_pests = q_pests.filter(Pest.user_id == user.id)
    pests = q_pests.all()

    for pest in pests:
        events.append(
            CalendarEvent(
                date=pest.date_detected,
                type="pest",
                title=f"Plaga: {pest.name}",
                description=pest.notes,
                related_id=pest.id,
            )
        )

    # ordenar por fecha
    events.sort(key=lambda e: e.date)

    return events
