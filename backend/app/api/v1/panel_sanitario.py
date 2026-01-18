from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

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

router = APIRouter(
    prefix="/sanitario",
    tags=["Panel sanitario"]
)

@router.get("/panel", summary="Panel sanitario completo del usuario")
def get_panel_sanitario(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # ---------------------------------------------------------
    # 1) Parcelas del usuario
    # ---------------------------------------------------------
    parcelas_usuario = (
        db.query(Plot)
        .filter(Plot.user_id == current_user.id)
        .all()
    )
    ids_parcelas = [p.id for p in parcelas_usuario]

    # ---------------------------------------------------------
    # 2) Cultivos del usuario
    # ---------------------------------------------------------
    cultivos_usuario = (
        db.query(CultivoParcela)
        .options(joinedload(CultivoParcela.cultivo_tipo))
        .filter(CultivoParcela.parcela_id.in_(ids_parcelas))
        .all()
    )
    ids_cultivos = [c.id for c in cultivos_usuario]

    # ---------------------------------------------------------
    # 3) Datos sanitarios asociados a esos cultivos
    # ---------------------------------------------------------
    riesgos = (
        db.query(RiesgoClimatico)
        .filter(RiesgoClimatico.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )

    alertas = (
        db.query(AlertaSanitaria)
        .filter(AlertaSanitaria.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(AlertaSanitaria.fecha.desc())
        .all()
    )

    eventos = (
        db.query(EventoSanitario)
        .filter(EventoSanitario.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(EventoSanitario.fecha.desc())
        .all()
    )

    recomendaciones = (
        db.query(Recomendacion)
        .filter(Recomendacion.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(Recomendacion.fecha_sugerida.desc())
        .all()
    )

    tratamientos = (
        db.query(TratamientoAplicado)
        .filter(TratamientoAplicado.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(TratamientoAplicado.fecha_inicio.desc())
        .all()
    )

    tareas = (
        db.query(Tarea)
        .filter(Tarea.cultivo_parcela_id.in_(ids_cultivos))
        .order_by(Tarea.fecha.desc())
        .all()
    )

    # ---------------------------------------------------------
    # 4) Construcción del panel por cultivo
    # ---------------------------------------------------------
    panel_items = []

    for cultivo in cultivos_usuario:
        parcela = next(p for p in parcelas_usuario if p.id == cultivo.parcela_id)

        r_cultivo = [r for r in riesgos if r.cultivo_parcela_id == cultivo.id]
        a_cultivo = [a for a in alertas if a.cultivo_parcela_id == cultivo.id]
        e_cultivo = [e for e in eventos if e.cultivo_parcela_id == cultivo.id]
        reco_cultivo = [r for r in recomendaciones if r.cultivo_parcela_id == cultivo.id]
        tto_cultivo = [t for t in tratamientos if t.cultivo_parcela_id == cultivo.id]
        tareas_cultivo = [t for t in tareas if t.cultivo_parcela_id == cultivo.id]

        panel_items.append({
            "parcela_id": parcela.id,
            "parcela_nombre": parcela.name,
            "cultivo_parcela_id": cultivo.id,
            "cultivo_tipo_id": cultivo.cultivo_tipo_id,
            "cultivo_tipo_nombre": cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else None,

            "riesgos": {
                "activos": sum(1 for r in r_cultivo if r.estado == "activo"),
                "historial": sum(1 for r in r_cultivo if r.estado != "activo"),
            },

            "alertas": {
                "pendientes": sum(1 for a in a_cultivo if a.estado == "pendiente"),
                "confirmadas": sum(1 for a in a_cultivo if a.estado == "confirmada"),
                "descartadas": sum(1 for a in a_cultivo if a.estado == "descartada"),
            },

            "eventos": {
                "activos": sum(1 for e in e_cultivo if e.estado == "activa"),
                "resueltos": sum(1 for e in e_cultivo if e.estado == "resuelta"),
            },

            "recomendaciones": {
                "pendientes": sum(1 for r in reco_cultivo if r.estado == "pendiente"),
                "realizadas": sum(1 for r in reco_cultivo if r.estado == "realizada"),
                "descartadas": sum(1 for r in reco_cultivo if r.estado == "descartada"),
            },

            "tratamientos": {
                "en_progreso": sum(1 for t in tto_cultivo if t.estado == "en_progreso"),
                "finalizados": sum(1 for t in tto_cultivo if t.estado == "finalizado"),
            },

            "tareas_sanitarias": {
                "pendientes": sum(1 for t in tareas_cultivo if t.estado == "pendiente"),
                "completadas": sum(1 for t in tareas_cultivo if t.estado == "completada"),
            },

            "plagas": {"activas": 0, "historial": 0},
            "enfermedades": {"activas": 0, "historial": 0},
        })

    return panel_items
