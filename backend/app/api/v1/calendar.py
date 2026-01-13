import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.cultivo_plan import CultivoPlan
from app.models.irrigation import Irrigation
from app.models.pest import Pest
from app.models.calendar_event import CalendarEvent  # Modelo SQLAlchemy

from app.schemas.calendar_event import (
    CalendarEvent as CalendarEventSchema,  # Esquema Pydantic
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventRead
)

router = APIRouter(tags=["Calendar"])


# ---------------------------------------------------------
# GET - Obtener SOLO los eventos del usuario (automáticos + manuales)
# ---------------------------------------------------------
@router.get("/", response_model=List[CalendarEventSchema])
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

    events: list[CalendarEventSchema] = []

    # --- Planes de cultivo (CultivoPlan) ---
    q_plans = db.query(CultivoPlan).filter(
        CultivoPlan.user_id == user.id
    )

    for plan in q_plans.all():
        if start_date <= plan.start_date <= end_date:
            events.append(CalendarEventSchema(
                date=plan.start_date,
                type="crop_plan",
                title=f"Inicio plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

        if plan.end_date and start_date <= plan.end_date <= end_date:
            events.append(CalendarEventSchema(
                date=plan.end_date,
                type="crop_plan",
                title=f"Fin plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

    # --- Riegos (Irrigation) ---
    q_irrigation = db.query(Irrigation).filter(
        Irrigation.date >= start_date,
        Irrigation.date <= end_date,
        Irrigation.user_id == user.id
    )

    for log in q_irrigation.all():
        events.append(CalendarEventSchema(
            date=log.date,
            type="irrigation",
            title=f"Riego parcela #{log.plot_id}",
            description=f"{log.liters} L",
            related_id=log.id
        ))

    # --- Plagas (Pest) ---
    q_pests = db.query(Pest).filter(
        Pest.date_detected >= start_date,
        Pest.date_detected <= end_date,
        Pest.user_id == user.id
    )

    for pest in q_pests.all():
        events.append(CalendarEventSchema(
            date=pest.date_detected,
            type="pest",
            title=f"Plaga: {pest.name}",
            description=pest.notes,
            related_id=pest.id
        ))

    # --- Eventos manuales (CalendarEventManual) ---
    manual_events = db.query(CalendarEvent).filter(
        CalendarEvent.date >= start_date,
        CalendarEvent.date <= end_date,
        CalendarEvent.user_id == user.id
    ).all()

    for ev in manual_events:
        events.append(CalendarEventSchema(
            date=ev.date,
            type=ev.type,
            title=ev.title,
            description=ev.description,
            related_id=ev.id
        ))

    events.sort(key=lambda e: e.date)
    return events


# ---------------------------------------------------------
# POST - Crear evento manual (solo para el usuario actual)
# ---------------------------------------------------------
@router.post("/", response_model=CalendarEventRead)
def create_event(
    event_in: CalendarEventCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = CalendarEvent(
        user_id=user.id,
        **event_in.model_dump()
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------
# PUT - Actualizar evento manual (solo si es del usuario)
# ---------------------------------------------------------
@router.put("/{event_id}", response_model=CalendarEventRead)
def update_event(
    event_id: int,
    event_in: CalendarEventUpdate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == user.id
    ).first()

    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado")

    for field, value in event_in.model_dump(exclude_unset=True).items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


# ---------------------------------------------------------
# DELETE - Eliminar evento manual (solo si es del usuario)
# ---------------------------------------------------------
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == user.id
    ).first()

    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado")

    db.delete(event)
    db.commit()
    return {"message": "Evento eliminado"}
