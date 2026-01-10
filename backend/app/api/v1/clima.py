from fastapi import APIRouter, Depends, HTTPException
from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.weather_service import get_real_weather
from app.services.climate_events import generar_eventos_reales
from app.services.agro_alerts import generar_alertas_semanales
from app.models.climate_event import ClimateEvent
from app.models.plot import Plot

router = APIRouter()

# ---------------------------------------------------------
# 🔥 ACTUALIZAR CLIMA REAL (Open‑Meteo → eventos climáticos)
# ---------------------------------------------------------
@router.post("/actualizar")
async def actualizar_clima(db: Session = Depends(get_db)):
    eventos = await generar_eventos_reales(db, days=3)
    return {"status": "ok", "eventos_generados": len(eventos)}

# ---------------------------------------------------------
# 🔥 ALERTAS AGRÍCOLAS SEMANALES (clima + cultivo)
# ---------------------------------------------------------
@router.get("/alertas-semana")
async def alertas_semana(db: Session = Depends(get_db)):
    """
    Devuelve alertas agrícolas para los próximos días,
    combinando clima por parcela y cultivos de cada parcela.
    No toca BD, solo calcula en tiempo real.
    """
    alertas = await generar_alertas_semanales(db)
    return alertas

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
    return eventos

# ---------------------------------------------------------
@router.get("/recientes")
def clima_reciente(db: Session = Depends(get_db)):
    desde = date.today() - timedelta(days=7)
    eventos = (
        db.query(ClimateEvent)
        .filter(ClimateEvent.date >= desde)
        .order_by(ClimateEvent.date.desc())
        .all()
    )

    # 🔥 Añadimos información de parcela
    eventos_serializados = []
    for ev in eventos:
        eventos_serializados.append({
            "id": ev.id,
            "type": ev.type,
            "intensity": float(ev.intensity),
            "date": ev.date.isoformat(),
            "plot_id": ev.plot_id,
            "plot_name": ev.plot.name if ev.plot else None,
        })

    return eventos_serializados

# ---------------------------------------------------------
@router.get("/real/{plot_id}")
async def clima_real(plot_id: int, db: Session = Depends(get_db)):
    parcela = db.query(Plot).filter(Plot.id == plot_id).first()
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no encontrada")

    if parcela.lat is None or parcela.lng is None:
        raise HTTPException(
            status_code=400,
            detail="La parcela no tiene coordenadas lat/lng configuradas",
        )

    try:
        clima = await get_real_weather(parcela.lat, parcela.lng)
        return clima
    except Exception as e:
        print("ERROR AL OBTENER CLIMA REAL:", e)
        raise HTTPException(
            status_code=500,
            detail="No se pudo obtener el clima real desde Open‑Meteo",
        )
