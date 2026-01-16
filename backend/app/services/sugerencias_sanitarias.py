from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.riesgo_climatico import RiesgoClimatico
from app.models.tratamiento import Tratamiento
from app.models.tratamiento_plaga import TratamientoPlaga
from app.models.tratamiento_enfermedad import TratamientoEnfermedad
from app.models.evento_sanitario import EventoSanitario
from app.models.sugerencia_sanitaria import SugerenciaSanitaria


def generar_sugerencias(db: Session, cultivo_parcela_id: int):
    hoy = date.today()

    # 1. Obtener riesgos recientes
    riesgos = (
        db.query(RiesgoClimatico)
        .filter(RiesgoClimatico.cultivo_parcela_id == cultivo_parcela_id)
        .order_by(RiesgoClimatico.fecha.desc())
        .all()
    )

    sugerencias = []

    for riesgo in riesgos:
        riesgo_nombre = riesgo.riesgo.lower()

        # 2. Buscar tratamientos asociados a esa plaga/enfermedad
        tratamientos_plaga = (
            db.query(Tratamiento)
            .join(TratamientoPlaga, Tratamiento.id == TratamientoPlaga.tratamiento_id)
            .filter(TratamientoPlaga.plaga_id.isnot(None))
            .all()
        )

        tratamientos_enfermedad = (
            db.query(Tratamiento)
            .join(TratamientoEnfermedad, Tratamiento.id == TratamientoEnfermedad.tratamiento_id)
            .filter(TratamientoEnfermedad.enfermedad_id.isnot(None))
            .all()
        )

        tratamientos = tratamientos_plaga + tratamientos_enfermedad

        # 3. Filtrar por estación del año
        estacion_actual = obtener_estacion(hoy)

        tratamientos = [
            t for t in tratamientos
            if not t.estaciones or estacion_actual in t.estaciones
        ]

        # 4. Evitar repeticiones recientes
        eventos = (
            db.query(EventoSanitario)
            .filter(
                EventoSanitario.cultivo_parcela_id == cultivo_parcela_id,
                EventoSanitario.tratamiento_id.in_([t.id for t in tratamientos])
            )
            .order_by(EventoSanitario.fecha.desc())
            .all()
        )

        tratamientos_filtrados = []
        for t in tratamientos:
            ultimo_evento = next((e for e in eventos if e.tratamiento_id == t.id), None)
            if not ultimo_evento:
                tratamientos_filtrados.append(t)
            else:
                dias = (hoy - ultimo_evento.fecha).days
                if not t.frecuencia_dias or dias >= t.frecuencia_dias:
                    tratamientos_filtrados.append(t)

        # 5. Crear sugerencias
        for t in tratamientos_filtrados:
            mensaje = (
                f"Riesgo de {riesgo.riesgo} ({riesgo.probabilidad:.2f}). "
                f"Se recomienda aplicar el tratamiento '{t.nombre}'."
            )

            sugerencia = SugerenciaSanitaria(
                cultivo_parcela_id=cultivo_parcela_id,
                fecha=hoy,
                riesgo=riesgo.riesgo,
                probabilidad=riesgo.probabilidad,
                tratamiento_id=t.id,
                mensaje=mensaje
            )

            db.add(sugerencia)
            sugerencias.append(sugerencia)

    db.commit()
    return sugerencias


def obtener_estacion(fecha: date):
    mes = fecha.month
    if mes in (12, 1, 2):
        return "invierno"
    if mes in (3, 4, 5):
        return "primavera"
    if mes in (6, 7, 8):
        return "verano"
    return "otoño"
