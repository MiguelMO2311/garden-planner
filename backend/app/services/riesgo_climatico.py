from datetime import date
from sqlalchemy.orm import Session

from app.models.cultivo_parcela import CultivoParcela
from app.models.cultivo_tipo_plaga import CultivoTipoPlaga
from app.models.cultivo_tipo_enfermedad import CultivoTipoEnfermedad
from app.models.plaga import Plaga
from app.models.enfermedad import Enfermedad
from app.models.riesgo_climatico import RiesgoClimatico


def calcular_riesgos_climaticos(
    db: Session,
    cultivo_parcela_id: int,
    temperatura: float,
    humedad: float,
    lluvia: float
):
    cultivo_parcela = db.query(CultivoParcela).filter(
        CultivoParcela.id == cultivo_parcela_id
    ).first()

    if not cultivo_parcela:
        return []

    cultivo_tipo_id = cultivo_parcela.cultivo_tipo_id

    # Obtener plagas asociadas al cultivo
    plagas = (
        db.query(Plaga)
        .join(CultivoTipoPlaga, Plaga.id == CultivoTipoPlaga.plaga_id)
        .filter(CultivoTipoPlaga.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    # Obtener enfermedades asociadas al cultivo
    enfermedades = (
        db.query(Enfermedad)
        .join(CultivoTipoEnfermedad, Enfermedad.id == CultivoTipoEnfermedad.enfermedad_id)
        .filter(CultivoTipoEnfermedad.cultivo_tipo_id == cultivo_tipo_id)
        .all()
    )

    riesgos = []

    # -----------------------------
    # Reglas agronómicas básicas
    # -----------------------------

    # Mildiu (hongos)
    if humedad > 80 and 10 < temperatura < 25:
        riesgos.append(("mildiu", 0.8))

    # Oídio
    if humedad < 60 and 18 < temperatura < 30:
        riesgos.append(("oídio", 0.6))

    # Araña roja
    if temperatura > 28 and humedad < 40:
        riesgos.append(("araña roja", 0.9))

    # Hongos por lluvia
    if lluvia > 5:
        riesgos.append(("hongos", 0.7))

    # Filtrar solo riesgos relevantes para el cultivo
    riesgos_finales = []
    nombres_plagas = {p.nombre.lower() for p in plagas}
    nombres_enfermedades = {e.nombre.lower() for e in enfermedades}

    for riesgo, prob in riesgos:
        if riesgo in nombres_plagas or riesgo in nombres_enfermedades:
            riesgos_finales.append((riesgo, prob))

    # Guardar en BD
    resultados = []
    for riesgo, prob in riesgos_finales:
        r = RiesgoClimatico(
            cultivo_parcela_id=cultivo_parcela_id,
            fecha=date.today(),
            riesgo=riesgo,
            probabilidad=prob,
            temperatura=temperatura,
            humedad=humedad,
            lluvia=lluvia
        )
        db.add(r)
        resultados.append(r)

    db.commit()
    return resultados
