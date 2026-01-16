from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.models.cultivo_parcela import CultivoParcela
from app.models.plaga import Plaga
from app.models.enfermedad import Enfermedad
from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.recomendacion import Recomendacion

router = APIRouter(tags=["Panel sanitario"])


@router.get("/panel")
def get_panel_sanitario(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[dict]:

    cultivos_parcela = (
        db.query(CultivoParcela)
        .filter(CultivoParcela.user_id == current_user.id)
        .all()
    )

    panel: list[dict] = []

    for cp in cultivos_parcela:
        plagas_count = (
            db.query(Plaga)
            .filter(Plaga.cultivo_parcela_id == cp.id)
            .count()
        )

        enfermedades_count = (
            db.query(Enfermedad)
            .filter(Enfermedad.cultivo_parcela_id == cp.id)
            .count()
        )

        tratamientos_activos_count = (
            db.query(TratamientoAplicado)
            .filter(
                TratamientoAplicado.cultivo_parcela_id == cp.id,
                TratamientoAplicado.activo == True,  # noqa: E712
            )
            .count()
        )

        recomendaciones_count = (
            db.query(Recomendacion)
            .filter(Recomendacion.cultivo_parcela_id == cp.id)
            .count()
        )

        panel.append(
            {
                "cultivo_parcela_id": cp.id,
                "parcela_id": cp.parcela_id,
                "parcela_nombre": cp.parcela.nombre if cp.parcela else None,
                "cultivo": cp.cultivo.nombre if cp.cultivo else None,
                "plagas": plagas_count,
                "enfermedades": enfermedades_count,
                "tratamientos_activos": tratamientos_activos_count,
                "recomendaciones": recomendaciones_count,
            }
        )

    return panel
