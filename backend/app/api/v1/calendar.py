import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user

# MODELOS
from app.models.cultivo_plan import CultivoPlan
from app.models.irrigation import Irrigation
from app.models.calendar_event import CalendarEvent

from app.models.riesgo_climatico import RiesgoClimatico
from app.models.alerta_sanitaria import AlertaSanitaria
from app.models.evento_sanitario import EventoSanitario
from app.models.recomendacion import Recomendacion
from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.tarea import Tarea

# SCHEMAS
from app.schemas.calendar_event import (
    CalendarEvent as CalendarEventSchema,
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventRead
)

router = APIRouter(tags=["Calendar"])


# ---------------------------------------------------------
# GET - Obtener TODOS los eventos del usuario
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

    # ---------------------------------------------------------
    # 1) PLANES DE CULTIVO
    # ---------------------------------------------------------
    planes = db.query(CultivoPlan).filter(
        CultivoPlan.user_id == user.id
    ).all()

    for plan in planes:
        if plan.start_date and start_date <= plan.start_date <= end_date:
            events.append(CalendarEventSchema(
                date=plan.start_date,
                type="crop_plan_start",
                title=f"Inicio plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

        if plan.end_date and start_date <= plan.end_date <= end_date:
            events.append(CalendarEventSchema(
                date=plan.end_date,
                type="crop_plan_end",
                title=f"Fin plan cultivo #{plan.id}",
                description=plan.notes,
                related_id=plan.id
            ))

    # ---------------------------------------------------------
    # 2) RIEGOS
    # ---------------------------------------------------------
    riegos = db.query(Irrigation).filter(
        Irrigation.user_id == user.id,
        Irrigation.date >= start_date,
        Irrigation.date <= end_date
    ).all()

    for r in riegos:
        events.append(CalendarEventSchema(
            date=r.date,
            type="irrigation",
            title=f"Riego en parcela #{r.plot_id}",
            description=f"{r.liters} L aplicados",
            related_id=r.id
        ))

    # ---------------------------------------------------------
    # 3) RIESGOS CLIMÁTICOS
    # ---------------------------------------------------------
    riesgos = db.query(RiesgoClimatico).filter(
        RiesgoClimatico.user_id == user.id,
        RiesgoClimatico.fecha >= start_date,
        RiesgoClimatico.fecha <= end_date
    ).all()

    for r in riesgos:
        events.append(CalendarEventSchema(
            date=r.fecha,
            type="riesgo",
            title=f"Riesgo: {r.riesgo}",
            description=f"Probabilidad {round(r.probabilidad * 100)}%",
            related_id=r.id
        ))

    # ---------------------------------------------------------
    # 4) ALERTAS SANITARIAS
    # ---------------------------------------------------------
    alertas = db.query(AlertaSanitaria).filter(
        AlertaSanitaria.user_id == user.id,
        AlertaSanitaria.fecha >= start_date,
        AlertaSanitaria.fecha <= end_date
    ).all()

    for a in alertas:
        events.append(CalendarEventSchema(
            date=a.fecha,
            type="alerta",
            title=f"Alerta sanitaria: {a.riesgo}",
            description=a.mensaje,
            related_id=a.id
        ))

    # ---------------------------------------------------------
    # 5) EVENTOS SANITARIOS
    # ---------------------------------------------------------
    eventos = db.query(EventoSanitario).filter(
        EventoSanitario.user_id == user.id,
        EventoSanitario.fecha >= start_date,
        EventoSanitario.fecha <= end_date
    ).all()

    for e in eventos:
        events.append(CalendarEventSchema(
            date=e.fecha,
            type="evento_sanitario",
            title=f"Evento sanitario: {e.riesgo or 'Evento'}",
            description=e.notas,
            related_id=e.id
        ))

    # ---------------------------------------------------------
    # 6) RECOMENDACIONES
    # ---------------------------------------------------------
    recomendaciones = db.query(Recomendacion).filter(
        Recomendacion.user_id == user.id,
        Recomendacion.fecha_sugerida != None,
        Recomendacion.fecha_sugerida >= start_date,
        Recomendacion.fecha_sugerida <= end_date
    ).all()

    for r in recomendaciones:
        events.append(CalendarEventSchema(
            date=r.fecha_sugerida,
            type="recomendacion",
            title="Recomendación sanitaria",
            description=r.mensaje,
            related_id=r.id
        ))

    # ---------------------------------------------------------
    # 7) TRATAMIENTOS APLICADOS
    # ---------------------------------------------------------
    tratamientos = db.query(TratamientoAplicado).filter(
        TratamientoAplicado.user_id == user.id
    ).all()

    for t in tratamientos:
        # Inicio del tratamiento
        if t.fecha_inicio and start_date <= t.fecha_inicio <= end_date:
            events.append(CalendarEventSchema(
                date=t.fecha_inicio,
                type="tratamiento_inicio",
                title="Inicio tratamiento",
                description=t.observaciones,
                related_id=t.id
            ))

        # Fin previsto
        if t.fecha_fin_prevista and start_date <= t.fecha_fin_prevista <= end_date:
            events.append(CalendarEventSchema(
                date=t.fecha_fin_prevista,
                type="tratamiento_fin_previsto",
                title="Fin previsto del tratamiento",
                description="Intervalo de seguridad",
                related_id=t.id
            ))

        # Fin real
        if t.fecha_fin and start_date <= t.fecha_fin <= end_date:
            events.append(CalendarEventSchema(
                date=t.fecha_fin,
                type="tratamiento_fin",
                title="Tratamiento finalizado",
                description=t.observaciones,
                related_id=t.id
            ))

    # ---------------------------------------------------------
    # 8) TAREAS (manuales y sanitarias)
    # ---------------------------------------------------------
    tareas = db.query(Tarea).filter(
        Tarea.user_id == user.id,
        Tarea.fecha != None,
        Tarea.fecha >= start_date,
        Tarea.fecha <= end_date
    ).all()

    for t in tareas:
        events.append(CalendarEventSchema(
            date=t.fecha,
            type=f"tarea_{t.origen}",
            title=t.titulo,
            description=t.descripcion,
            related_id=t.id
        ))

    # ---------------------------------------------------------
    # 9) EVENTOS MANUALES
    # ---------------------------------------------------------
    manuales = db.query(CalendarEvent).filter(
        CalendarEvent.user_id == user.id,
        CalendarEvent.date >= start_date,
        CalendarEvent.date <= end_date
    ).all()

    for ev in manuales:
        events.append(CalendarEventSchema(
            date=ev.date,
            type=ev.type,
            title=ev.title,
            description=ev.description,
            related_id=ev.id
        ))

    # ORDENAR POR FECHA
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
    event = CalendarEvent(
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
# DELETE - Eliminar evento manual
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
