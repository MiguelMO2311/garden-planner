# app/services/agro_recommendations.py

from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.plot import Plot
from app.models.climate_event import ClimateEvent
from app.services.agro_rules import (
    reglas_lluvia,
    reglas_helada,
    reglas_calor,
    reglas_viento,
    reglas_plagas,
    reglas_calendario,
)


# ---------------------------------------------------------
# OBTENER CULTIVO ACTIVO DE LA PARCELA
# ---------------------------------------------------------
def obtener_cultivo_activo(plot):
    """
    Devuelve el cultivo activo de la parcela.
    Un cultivo activo es:
    - estado == "activo"
    - fecha_cosecha == None
    """
    for cultivo in plot.cultivos:
        if cultivo.estado == "activo" and cultivo.fecha_cosecha is None:
            return cultivo
    return None


# ---------------------------------------------------------
# CALCULAR DÍAS DESDE SIEMBRA
# ---------------------------------------------------------
def calcular_dias_desde_siembra(cultivo):
    if cultivo.fecha_siembra:
        return (date.today() - cultivo.fecha_siembra).days
    return None


# ---------------------------------------------------------
# OBTENER EVENTOS CLIMÁTICOS RECIENTES
# ---------------------------------------------------------
def obtener_eventos_climaticos_recientes(db: Session, plot_id: int, dias: int = 7):
    desde = date.today() - timedelta(days=dias)

    return (
        db.query(ClimateEvent)
        .filter(
            ClimateEvent.plot_id == plot_id,
            ClimateEvent.date >= desde,
        )
        .order_by(ClimateEvent.date.desc())
        .all()
    )


# ---------------------------------------------------------
# CALCULAR CONTEXTO AGRÍCOLA DE LA PARCELA
# ---------------------------------------------------------
def calcular_contexto_parcela(plot):
    contexto = {}

    cultivo_activo = obtener_cultivo_activo(plot)
    if cultivo_activo:
        # Días desde siembra
        dias = calcular_dias_desde_siembra(cultivo_activo)
        contexto["dias_desde_siembra"] = dias

        # Tipo de cultivo (CultivoTipo)
        tipo = cultivo_activo.cultivo_tipo
        contexto["cultivo_tipo"] = tipo

        # Necesidades de agua
        contexto["litros_agua_semana"] = tipo.litros_agua_semana

        # Duración del ciclo
        contexto["dias_crecimiento"] = tipo.dias_crecimiento

        # Temporada óptima
        contexto["temporada_optima"] = tipo.temporada_optima

    return contexto


# ---------------------------------------------------------
# MOTOR PRINCIPAL DE RECOMENDACIONES
# ---------------------------------------------------------
def generar_recomendaciones_para_parcela(db: Session, plot_id: int):
    plot = db.query(Plot).filter(Plot.id == plot_id).first()
    if not plot:
        return []

    cultivo_activo = obtener_cultivo_activo(plot)
    if not cultivo_activo:
        # No hay cultivo → no hay recomendaciones
        return []

    cultivo_tipo = cultivo_activo.cultivo_tipo

    eventos_clima = obtener_eventos_climaticos_recientes(db, plot_id)
    contexto = calcular_contexto_parcela(plot)

    recomendaciones: list[dict] = []

    for evento in eventos_clima:
        # Cada conjunto de reglas devuelve una lista de recomendaciones (o lista vacía)
        resultados_lluvia = reglas_lluvia(evento, cultivo_tipo, contexto)
        resultados_helada = reglas_helada(evento, cultivo_tipo, contexto)
        resultados_calor = reglas_calor(evento, cultivo_tipo, contexto)
        resultados_viento = reglas_viento(evento, cultivo_tipo, contexto)
        resultados_plagas = reglas_plagas(evento, cultivo_tipo, contexto)
        resultados_calendario = reglas_calendario(evento, cultivo_tipo, contexto)

        todas_respuestas = (
            resultados_lluvia
            + resultados_helada
            + resultados_calor
            + resultados_viento
            + resultados_plagas
            + resultados_calendario
        )

        for rec in todas_respuestas:
            recomendaciones.append(
                {
                    "plot_id": plot_id,
                    "plot_name": plot.name,
                    "date": evento.date.isoformat(),
                    "climate_event_type": evento.type,
                    "climate_risk": evento.risk_level,
                    "recommendation_type": rec.get("tipo"),
                    "message": rec.get("mensaje"),
                    "dias_desde_siembra": contexto.get("dias_desde_siembra"),
                    "cultivo": cultivo_tipo.nombre,
                }
            )

    return recomendaciones
