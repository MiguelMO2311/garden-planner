# app/api/v1/riesgos_climaticos.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.riesgo_climatico import RiesgoClimatico
from app.models.alerta_sanitaria import AlertaSanitaria
from app.models.cultivo_parcela import CultivoParcela
from app.models.user import User

from app.schemas.riesgo_climatico_schema import (
    RiesgoClimaticoCreate,
    RiesgoClimaticoRead
)

router = APIRouter(tags=["Riesgos climáticos"])


# ---------------------------------------------------------
# CREAR RIESGO CLIMÁTICO
# ---------------------------------------------------------
@router.post("/", response_model=RiesgoClimaticoRead)
def create_riesgo(
    data: RiesgoClimaticoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = db.query(CultivoParcela).filter(
        CultivoParcela.id == data.cultivo_parcela_id
    ).first()

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado")

    riesgo = RiesgoClimatico(
        cultivo_parcela_id=cultivo.id,
        user_id=user.id,
        fecha=data.fecha or date.today(),
        riesgo=data.riesgo,
        probabilidad=data.probabilidad,
        temperatura=data.temperatura,
        humedad=data.humedad,
        lluvia=data.lluvia,
        estado="activo"
    )

    db.add(riesgo)
    db.commit()
    db.refresh(riesgo)

    # ---------------------------------------------------------
    # GENERAR ALERTA AUTOMÁTICA SI SUPERA UMBRAL
    # ---------------------------------------------------------
    UMBRAL_ALERTA = 0.6  # 60%

    if riesgo.probabilidad >= UMBRAL_ALERTA:
        alerta = AlertaSanitaria(
            cultivo_parcela_id=cultivo.id,
            user_id=user.id,
            fecha=riesgo.fecha,
            riesgo=riesgo.riesgo,
            probabilidad=riesgo.probabilidad,
            prioridad="alta" if riesgo.probabilidad >= 0.8 else "media",
            mensaje=f"Riesgo elevado de {riesgo.riesgo}",
            estado="pendiente"
        )
        db.add(alerta)
        db.commit()

    return riesgo


# ---------------------------------------------------------
# LISTAR RIESGOS DEL USUARIO
# ---------------------------------------------------------
@router.get("/", response_model=list[RiesgoClimaticoRead])
def list_riesgos(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return (
        db.query(RiesgoClimatico)
        .filter(RiesgoClimatico.user_id == user.id)
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )


# ---------------------------------------------------------
# OBTENER RIESGO POR ID
# ---------------------------------------------------------
@router.get("/{riesgo_id}", response_model=RiesgoClimaticoRead)
def get_riesgo(
    riesgo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    riesgo = db.query(RiesgoClimatico).filter(
        RiesgoClimatico.id == riesgo_id,
        RiesgoClimatico.user_id == user.id
    ).first()

    if not riesgo:
        raise HTTPException(404, "Riesgo no encontrado")

    return riesgo


# ---------------------------------------------------------
# ARCHIVAR RIESGO
# ---------------------------------------------------------
@router.post("/{riesgo_id}/archivar")
def archivar_riesgo(
    riesgo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    riesgo = db.query(RiesgoClimatico).filter(
        RiesgoClimatico.id == riesgo_id,
        RiesgoClimatico.user_id == user.id
    ).first()

    if not riesgo:
        raise HTTPException(404, "Riesgo no encontrado")

    riesgo.estado = "archivado"
    db.commit()

    return {"message": "Riesgo archivado correctamente"}
