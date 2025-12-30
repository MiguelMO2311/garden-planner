import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.cultivo_plan import CultivoPlan
from app.models.irrigation import Irrigation
from app.models.pest import Pest
from app.models.calendar_event import CalendarEventManual

from app.schemas.calendar_event import (
    CalendarEvent,
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventRead
)

router = APIRouter(tags=["Calendar"])


# ---------------------------------------------------------
# GET - Obtener TODOS los eventos (automáticos + manuales)
# ---------------------------------------------------------
@router.get("/", response_model=List[CalendarEvent])
def get_calendar(
    start_date: datetime.date | None = None,
    end_date: datetime.date | None = None,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    today = datetime.date.today()
    if start_date is None:
        start_date = today
    if end_date is None:
        end_date = today.replace(year=today.year + 1)

    events: list[CalendarEvent] = []

    # --- Crop Plans ---
    q_plans = db.query(CultivoPlan)
    if user.role != "admin":
        q_plans = q_plans.filter(CultivoPlan.user_id == user.id)

    for plan in q_plans.all():
        if start_date <= plan.start_date <= end_date:
            events.append(CalendarEvent(
                date=plan.start_date,
                type="crop_plan",
                title=f"Inicio plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

        if plan.end_date and start_date <= plan.end_date <= end_date:
            events.append(CalendarEvent(
                date=plan.end_date,
                type="crop_plan",
                title=f"Fin plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

    # --- Riegos ---
    q_irrigation = db.query(Irrigation).filter(
        Irrigation.date >= start_date,
        Irrigation.date <= end_date
    )
    if user.role != "admin":
        q_irrigation = q_irrigation.filter(Irrigation.user_id == user.id)

    for log in q_irrigation.all():
        events.append(CalendarEvent(
            date=log.date,
            type="irrigation",
            title=f"Riego parcela #{log.plot_id}",
            description=f"{log.liters} L",
            related_id=log.id
        ))

    # --- Plagas ---
    q_pests = db.query(Pest).filter(
        Pest.date_detected >= start_date,
        Pest.date_detected <= end_date
    )
    if user.role != "admin":
        q_pests = q_pests.filter(Pest.user_id == user.id)

    for pest in q_pests.all():
        events.append(CalendarEvent(
            date=pest.date_detected,
            type="pest",
            title=f"Plaga: {pest.name}",
            description=pest.notes,
            related_id=pest.id
        ))

    # --- Eventos manuales ---
    manual_events = db.query(CalendarEventManual).filter(
        CalendarEventManual.date >= start_date,
        CalendarEventManual.date <= end_date,
        CalendarEventManual.user_id == user.id
    ).all()

    for ev in manual_events:
        events.append(CalendarEvent(
            date=ev.date,
            type=ev.type,
            title=ev.title,
            description=ev.description,
            related_id=ev.id
        ))

    events.sort(key=lambda e: e.date)
    return events


# ---------------------------------------------------------
# POST - Crear evento manual
# ---------------------------------------------------------
@router.post("/", response_model=CalendarEventRead)
def create_event(
    event_in: CalendarEventCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = CalendarEventManual(
        user_id=user.id,
        **event_in.model_dump()
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------
# PUT - Actualizar evento manual
# ---------------------------------------------------------
@router.put("/{event_id}", response_model=CalendarEventRead)
def update_event(
    event_id: int,
    event_in: CalendarEventUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = db.query(CalendarEventManual).filter(
        CalendarEventManual.id == event_id,
        CalendarEventManual.user_id == user.id
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    for field, value in event_in.model_dump(exclude_unset=True).items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------
# DELETE - Eliminar evento manual
# ---------------------------------------------------------
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = db.query(CalendarEventManual).filter(
        CalendarEventManual.id == event_id,
        CalendarEventManual.user_id == user.id
    ).first()

    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")

    db.delete(event)
    db.commit()
    return {"message": "Evento eliminado"}
