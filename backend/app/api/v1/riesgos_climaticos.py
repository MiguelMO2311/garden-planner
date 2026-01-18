from fastapi import APIRouter, Depends, HTTPException, Query
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

router = APIRouter(
    prefix="/riesgos_climaticos",
    tags=["Riesgos climáticos"]
)

# ---------------------------------------------------------
# CREAR RIESGO CLIMÁTICO
# ---------------------------------------------------------
@router.post("/", response_model=RiesgoClimaticoRead)
def create_riesgo(
    data: RiesgoClimaticoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    cultivo = (
        db.query(CultivoParcela)
        .filter(
            CultivoParcela.id == data.cultivo_parcela_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not cultivo:
        raise HTTPException(404, "Cultivo en parcela no encontrado o no pertenece al usuario")

    riesgo = RiesgoClimatico(
        cultivo_parcela_id=cultivo.id,
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

    UMBRAL_ALERTA = 0.6

    if riesgo.probabilidad >= UMBRAL_ALERTA:
        alerta = AlertaSanitaria(
            cultivo_parcela_id=cultivo.id,
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
# LISTAR RIESGOS POR CULTIVO  ← MOVIDO ARRIBA
# ---------------------------------------------------------
@router.get("/por_cultivo", response_model=list[RiesgoClimaticoRead])
def list_riesgos_por_cultivo(
    cultivo_parcela_id: int = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    riesgos = (
        db.query(RiesgoClimatico)
        .join(CultivoParcela, CultivoParcela.id == RiesgoClimatico.cultivo_parcela_id)
        .filter(
            CultivoParcela.user_id == user.id,
            RiesgoClimatico.cultivo_parcela_id == cultivo_parcela_id
        )
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )
    return riesgos

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
        .join(CultivoParcela, CultivoParcela.id == RiesgoClimatico.cultivo_parcela_id)
        .filter(CultivoParcela.user_id == user.id)
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )

# ---------------------------------------------------------
# OBTENER RIESGO POR ID  ← AHORA ESTÁ DEBAJO
# ---------------------------------------------------------
@router.get("/{riesgo_id}", response_model=RiesgoClimaticoRead)
def get_riesgo(
    riesgo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    riesgo = (
        db.query(RiesgoClimatico)
        .join(CultivoParcela, CultivoParcela.id == RiesgoClimatico.cultivo_parcela_id)
        .filter(
            RiesgoClimatico.id == riesgo_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not riesgo:
        raise HTTPException(404, "Riesgo no encontrado o no pertenece al usuario")

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
    riesgo = (
        db.query(RiesgoClimatico)
        .join(CultivoParcela, CultivoParcela.id == RiesgoClimatico.cultivo_parcela_id)
        .filter(
            RiesgoClimatico.id == riesgo_id,
            CultivoParcela.user_id == user.id
        )
        .first()
    )

    if not riesgo:
        raise HTTPException(404, "Riesgo no encontrado o no pertenece al usuario")

    riesgo.estado = "archivado"
    db.commit()

    return {"message": "Riesgo archivado correctamente"}
