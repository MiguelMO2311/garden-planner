# app/services/agro_mediator.py

from sqlalchemy.orm import Session
from app.services.agro_recommendations import generar_recomendaciones_para_parcela
from app.models.plot import Plot


def generar_recomendaciones_globales(db: Session):
    """
    Opcional: si quieres generar recomendaciones para TODAS las parcelas.
    """
    parcelas = db.query(Plot).all()
    todas = []

    for parcela in parcelas:
        recs = generar_recomendaciones_para_parcela(db, parcela.id)
        todas.extend(recs)

    return todas
