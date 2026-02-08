# agro_rules/engine.py

"""
Motor unificado de reglas agronómicas.
Combina reglas de clima, suelo, fenología, plagas y factores generales.
"""

from .lluvia import reglas_lluvia
from .helada import reglas_helada
from .calor import reglas_calor
from .viento import reglas_viento
from .humedad import reglas_humedad
from .plagas import reglas_plagas
from .suelo import reglas_suelo
from .fenologia import reglas_fenologia
from .generales import reglas_generales


# Lista de módulos de reglas en orden lógico
REGLAS = [
    reglas_lluvia,
    reglas_helada,
    reglas_calor,
    reglas_viento,
    reglas_humedad,
    reglas_plagas,
    reglas_suelo,
    reglas_fenologia,
    reglas_generales,
]


def ejecutar_reglas(evento_clima, cultivo, contexto=None):
    """
    Ejecuta todas las reglas agronómicas disponibles y devuelve
    una lista combinada de recomendaciones sanitarias.

    - evento_clima: objeto con .type, .risk_level, .intensity
    - cultivo: objeto CultivoParcela
    - contexto: dict opcional con datos adicionales (suelo, fase, historial, etc.)
    """

    recomendaciones = []

    for regla in REGLAS:
        try:
            resultado = regla(evento_clima, cultivo, contexto)
            if resultado:
                recomendaciones.extend(resultado)
        except Exception as e:
            # No rompemos el motor si una regla falla
            print(f"[WARN] Regla {regla.__name__} falló: {e}")

    # Eliminar duplicados por (tipo, objetivo, mensaje)
    recomendaciones_unicas = []
    vistos = set()

    for r in recomendaciones:
        clave = (r.get("tipo"), r.get("objetivo"), r.get("mensaje"))
        if clave not in vistos:
            recomendaciones_unicas.append(r)
            vistos.add(clave)

    return recomendaciones_unicas
