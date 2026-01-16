from datetime import date
from sqlalchemy.orm import Session

from app.models.alerta_sanitaria import AlertaSanitaria
from app.models.riesgo_climatico import RiesgoClimatico


def generar_alertas_desde_riesgos(db: Session, cultivo_parcela_id: int):
    riesgos = (
        db.query(RiesgoClimatico)
        .filter(RiesgoClimatico.cultivo_parcela_id == cultivo_parcela_id)
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )

    alertas = []

    for r in riesgos:
        # Determinar prioridad
        if r.probabilidad >= 0.75:
            prioridad = "alta"
        elif r.probabilidad >= 0.5:
            prioridad = "media"
        else:
            prioridad = "baja"

        mensaje = f"Riesgo de {r.riesgo} ({r.probabilidad:.2f})."

        alerta = AlertaSanitaria(
            cultivo_parcela_id=cultivo_parcela_id,
            fecha=date.today(),
            riesgo=r.riesgo,
            probabilidad=r.probabilidad,
            prioridad=prioridad,
            mensaje=mensaje
        )

        db.add(alerta)
        alertas.append(alerta)

    db.commit()
    return alertas
