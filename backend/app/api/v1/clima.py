from fastapi import APIRouter, Depends, HTTPException
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.core.auth import get_current_user

from app.core.database import get_db
from app.services.weather_service import get_real_weather
from app.services.climate_events import generar_eventos_reales
from app.models.climate_event import ClimateEvent
from app.models.plot import Plot

router = APIRouter()

# ---------------------------------------------------------
# 🔥 ALERTAS AGRÍCOLAS SEMANALES (se calculan en tiempo real)
# ---------------------------------------------------------
from app.services.agro_alerts import generar_alertas_semanales

@router.get("/alertas-semana")
async def alertas_semana(db: Session = Depends(get_db)):
    return await generar_alertas_semanales(db)


# ---------------------------------------------------------
# 🔥 EVENTOS POR PARCELA
# ---------------------------------------------------------
@router.get("/parcelas/{plot_id}")
def clima_por_parcela(plot_id: int, db: Session = Depends(get_db)):
    parcela = db.query(Plot).filter(Plot.id == plot_id).first()
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no encontrada")

    eventos = (
        db.query(ClimateEvent)
        .filter(ClimateEvent.plot_id == plot_id)
        .order_by(ClimateEvent.date.asc())
        .all()
    )

    return [
        {
            "id": ev.id,
            "type": ev.type,
            "intensity": float(ev.intensity),
            "date": ev.date.isoformat(),
            "plot_id": ev.plot_id,
            "plot_name": ev.plot.name if ev.plot else None,
            "description": ev.description,
            "risk_level": ev.risk_level,
        }
        for ev in eventos
    ]


# ---------------------------------------------------------
# 🔥 EVENTOS RECIENTES (SIN regeneración automática)
# ---------------------------------------------------------
@router.get("/recientes")
async def clima_reciente(db: Session = Depends(get_db)):
    desde = date.today() - timedelta(days=7)

    eventos = (
        db.query(ClimateEvent)
        .filter(ClimateEvent.date >= desde)
        .order_by(ClimateEvent.date.desc())
        .all()
    )

    # ❌ Ya NO generamos eventos automáticamente
    # ✔ Si no hay eventos, devolvemos lista vacía
    return [
        {
            "id": ev.id,
            "type": ev.type,
            "intensity": float(ev.intensity),
            "date": ev.date.isoformat(),
            "plot_id": ev.plot_id,
            "plot_name": ev.plot.name if ev.plot else None,
            "description": ev.description,
            "risk_level": ev.risk_level,
        }
        for ev in eventos
    ]


# ---------------------------------------------------------
# 🔥 ENDPOINT MANUAL PARA GENERAR EVENTOS REALES
# ---------------------------------------------------------
@router.post("/generar-reales")
async def generar_reales(db: Session = Depends(get_db)):
    eventos = await generar_eventos_reales(db)
    return {
        "creados": len(eventos),
        "eventos": [
            {
                "id": ev.id,
                "type": ev.type,
                "date": ev.date.isoformat(),
                "plot_id": ev.plot_id,
                "risk_level": ev.risk_level,
            }
            for ev in eventos
        ],
    }


# ---------------------------------------------------------
# 🔥 CLIMA REAL DIRECTO (sin guardar)
# ---------------------------------------------------------
@router.get("/real/{plot_id}")
async def clima_real(plot_id: int, db: Session = Depends(get_db)):
    parcela = db.query(Plot).filter(Plot.id == plot_id).first()
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no encontrada")

    if parcela.lat is None or parcela.lng is None:
        raise HTTPException(status_code=400, detail="La parcela no tiene coordenadas definidas")

    clima = await get_real_weather(parcela.lat, parcela.lng)
    return clima
