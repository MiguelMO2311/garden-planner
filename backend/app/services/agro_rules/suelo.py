# agro_rules/suelo.py

def reglas_suelo(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en el comportamiento del suelo frente a condiciones climáticas.
    - evento_clima: objeto con .type, .risk_level, .intensity
    - cultivo: objeto CultivoParcela
    - contexto: dict opcional con:
        - suelo: "arcilloso", "arenoso", "franco"
        - drenaje: "bueno", "medio", "malo"
        - compactacion: "alta", "media", "baja"
        - pendiente: "alta", "media", "baja"
    """

    recomendaciones = []

    if not contexto:
        return recomendaciones

    suelo = contexto.get("suelo")
    drenaje = contexto.get("drenaje")
    compactacion = contexto.get("compactacion")
    pendiente = contexto.get("pendiente")

    tipo = evento_clima.type
    riesgo = evento_clima.risk_level

    # ============================================================
    # 🌧 LLUVIA + SUELO ARCILLOSO → riesgo de anegamiento
    # ============================================================
    if tipo == "lluvia" and suelo == "arcilloso" and riesgo in ["medium", "high"]:
        recomendaciones.append({
            "tipo": "drenaje",
            "riesgo": riesgo,
            "objetivo": "anegamiento",
            "mensaje": (
                "El suelo arcilloso retiene agua y drena lentamente. "
                "Revisar drenajes y evitar encharcamientos prolongados."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🌧 LLUVIA + COMPACTACIÓN → asfixia radicular
    # ============================================================
    if tipo == "lluvia" and compactacion == "alta":
        recomendaciones.append({
            "tipo": "manejo_suelo",
            "riesgo": riesgo,
            "objetivo": "asfixia_radicular",
            "mensaje": (
                "La compactación del suelo reduce la aireación. "
                "Riesgo de asfixia radicular tras lluvias intensas."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🔥 CALOR + SUELO ARENOSO → deshidratación acelerada
    # ============================================================
    if tipo in ["ola_de_calor", "calor_extremo"] and suelo == "arenoso":
        recomendaciones.append({
            "tipo": "ajuste_riego",
            "riesgo": riesgo,
            "objetivo": "estres_hidrico",
            "mensaje": (
                "El suelo arenoso tiene baja retención de agua. "
                "Aumentar la frecuencia de riego en días de calor."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 💨 VIENTO + PENDIENTE → erosión del suelo
    # ============================================================
    if tipo in ["viento_fuerte", "viento_muy_fuerte"] and pendiente == "alta":
        recomendaciones.append({
            "tipo": "proteccion_suelo",
            "riesgo": riesgo,
            "objetivo": "erosion",
            "mensaje": (
                "Pendiente elevada y viento fuerte. Riesgo de erosión del suelo. "
                "Reforzar cubiertas vegetales o acolchados."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
