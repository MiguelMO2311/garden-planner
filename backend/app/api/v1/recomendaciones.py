# app/api/v1/recomendaciones.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.agro_recommendations import generar_recomendaciones_para_parcela
from app.services.agro_mediator import generar_recomendaciones_globales
from app.models.plot import Plot

router = APIRouter()


@router.get("/parcelas/{plot_id}")
def recomendaciones_por_parcela(plot_id: int, db: Session = Depends(get_db)):
    parcela = db.query(Plot).filter(Plot.id == plot_id).first()
    if not parcela:
        raise HTTPException(status_code=404, detail="Parcela no encontrada")

    recomendaciones = generar_recomendaciones_para_parcela(db, plot_id)
    return recomendaciones


@router.get("/global")
def recomendaciones_globales(db: Session = Depends(get_db)):
    """
    Opcional: recomendaciones para todas las parcelas del usuario/sistema.
    """
    return generar_recomendaciones_globales(db)
