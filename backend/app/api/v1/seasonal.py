from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models.cultivo_tipo import CultivoTipo

router = APIRouter(prefix="/season", tags=["Seasonal Recommendations"])

# Mapeo simple de meses a estaciones
SEASONS = {
    12: "Invierno", 1: "Invierno", 2: "Invierno",
    3: "Primavera", 4: "Primavera", 5: "Primavera",
    6: "Verano", 7: "Verano", 8: "Verano",
    9: "Otoño", 10: "Otoño", 11: "Otoño"
}

@router.get("/recommendations")
def get_recommendations(month: int | None = None, db: Session = Depends(get_db)):
    """
    Devuelve cultivos recomendados según el mes o la estación actual.
    """
    # Si no se pasa mes, usar el actual
    if month is None:
        month = datetime.now().month

    season = SEASONS.get(month, "Desconocida")

    # Buscar cultivos cuya estación óptima coincida
    crops = db.query(CultivoTipo).filter(CultivoTipo.optimal_season == season).all()

    return {
        "month": month,
        "season": season,
        "recommended_crops": [
            {
                "id": crop.id,
                "name": crop.name,
                "growth_days": crop.growth_days,
                "water_liters_week": crop.water_liters_week
            }
            for crop in crops
        ]
    }
