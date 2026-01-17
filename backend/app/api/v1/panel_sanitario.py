# app/api/v1/panel_sanitario.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.models.cultivo_parcela import CultivoParcela
from app.models.plot import Plot
from app.models.riesgo_climatico import RiesgoClimatico
from app.models.alerta_sanitaria import AlertaSanitaria
from app.models.evento_sanitario import EventoSanitario
from app.models.recomendacion import Recomendacion
from app.models.tratamiento_aplicado import TratamientoAplicado
from app.models.tarea import Tarea

router = APIRouter(tags=["Panel sanitario"])


@router.get("/panel", response_model=List[dict])
def get_panel_sanitario(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[dict]:

    cultivos_parcela = (
        db.query(CultivoParcela)
        .join(Plot)
        .options(
            joinedload(CultivoParcela.parcela),
            joinedload(CultivoParcela.cultivo_tipo),
        )
        .filter(Plot.user_id == current_user.id)
        .all()
    )

    panel: list[dict] = []

    for cp in cultivos_parcela:

        # -----------------------
        # RIESGOS CLIMÁTICOS
        # -----------------------
        riesgos = (
            db.query(RiesgoClimatico)
            .filter(
                RiesgoClimatico.cultivo_parcela_id == cp.id,
                RiesgoClimatico.user_id == current_user.id
            )
            .all()
        )
        riesgos_activos = [r for r in riesgos if r.estado == "activo"]
        riesgos_historial = [r for r in riesgos if r.estado != "activo"]

        # -----------------------
        # ALERTAS SANITARIAS
        # -----------------------
        alertas = (
            db.query(AlertaSanitaria)
            .filter(
                AlertaSanitaria.cultivo_parcela_id == cp.id,
                AlertaSanitaria.user_id == current_user.id
            )
            .all()
        )
        alertas_pendientes = [a for a in alertas if a.estado == "pendiente"]
        alertas_confirmadas = [a for a in alertas if a.estado == "confirmada"]
        alertas_descartadas = [a for a in alertas if a.estado == "descartada"]

        # -----------------------
        # EVENTOS SANITARIOS
        # -----------------------
        eventos = (
            db.query(EventoSanitario)
            .filter(
                EventoSanitario.cultivo_parcela_id == cp.id,
                EventoSanitario.user_id == current_user.id
            )
            .all()
        )
        eventos_activos = [e for e in eventos if e.estado == "activa"]
        eventos_resueltos = [e for e in eventos if e.estado == "resuelta"]

        # -----------------------
        # RECOMENDACIONES
        # -----------------------
        recomendaciones = (
            db.query(Recomendacion)
            .filter(
                Recomendacion.cultivo_parcela_id == cp.id,
                Recomendacion.user_id == current_user.id
            )
            .all()
        )
        recomendaciones_pendientes = [r for r in recomendaciones if r.estado == "pendiente"]
        recomendaciones_realizadas = [r for r in recomendaciones if r.estado == "realizada"]
        recomendaciones_descartadas = [r for r in recomendaciones if r.estado == "descartada"]

        # -----------------------
        # TRATAMIENTOS APLICADOS
        # -----------------------
        tratamientos = (
            db.query(TratamientoAplicado)
            .filter(
                TratamientoAplicado.cultivo_parcela_id == cp.id,
                TratamientoAplicado.user_id == current_user.id
            )
            .all()
        )
        tratamientos_en_progreso = [t for t in tratamientos if t.estado == "en_progreso"]
        tratamientos_finalizados = [t for t in tratamientos if t.estado == "finalizado"]

        # -----------------------
        # TAREAS SANITARIAS
        # -----------------------
        tareas = (
            db.query(Tarea)
            .filter(
                Tarea.cultivo_parcela_id == cp.id,
                Tarea.user_id == current_user.id
            )
            .all()
        )
        tareas_sanitarias = [t for t in tareas if t.origen == "sanitario"]
        tareas_sanitarias_pendientes = [
            t for t in tareas_sanitarias if t.estado in ("pendiente", "en_progreso")
        ]
        tareas_sanitarias_completadas = [
            t for t in tareas_sanitarias if t.estado in ("completada", "finalizada")
        ]

        panel.append(
            {
                "cultivo_parcela_id": cp.id,
                "parcela_id": cp.parcela_id,
                "parcela_nombre": cp.parcela.nombre if cp.parcela else None,
                "cultivo_tipo_id": cp.cultivo_tipo_id,
                "cultivo_tipo_nombre": cp.cultivo_tipo.nombre if cp.cultivo_tipo else None,

                "riesgos": {
                    "activos": len(riesgos_activos),
                    "historial": len(riesgos_historial),
                },
                "alertas": {
                    "pendientes": len(alertas_pendientes),
                    "confirmadas": len(alertas_confirmadas),
                    "descartadas": len(alertas_descartadas),
                },
                "eventos": {
                    "activos": len(eventos_activos),
                    "resueltos": len(eventos_resueltos),
                },
                "recomendaciones": {
                    "pendientes": len(recomendaciones_pendientes),
                    "realizadas": len(recomendaciones_realizadas),
                    "descartadas": len(recomendaciones_descartadas),
                },
                "tratamientos": {
                    "en_progreso": len(tratamientos_en_progreso),
                    "finalizados": len(tratamientos_finalizados),
                },
                "tareas_sanitarias": {
                    "pendientes": len(tareas_sanitarias_pendientes),
                    "completadas": len(tareas_sanitarias_completadas),
                },
            }
        )

    return panel
