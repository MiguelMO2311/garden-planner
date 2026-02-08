# agro_rules/generales.py

def reglas_generales(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias generales basadas en historial, sensibilidad y manejo previo.
    - evento_clima: objeto con .type, .risk_level, .intensity
    - cultivo: objeto CultivoParcela
    - contexto: dict opcional con:
        - historial: lista de enfermedades previas
        - sensibilidad: "alta", "media", "baja"
        - densidad: "alta", "media", "baja"
        - manejo: "estresado", "normal"
    """

    recomendaciones = []

    if not contexto:
        return recomendaciones

    historial = contexto.get("historial") or []
    sensibilidad = contexto.get("sensibilidad")
    densidad = contexto.get("densidad")
    manejo = contexto.get("manejo")

    tipo = evento_clima.type
    riesgo = evento_clima.risk_level

    # ============================================================
    # 🔁 HISTORIAL DE ENFERMEDADES → refuerzo preventivo
    # ============================================================
    if "mildiu" in historial and tipo in ["lluvia", "humedad"]:
        recomendaciones.append({
            "tipo": "refuerzo_prevencion",
            "riesgo": riesgo,
            "objetivo": "mildiu",
            "mensaje": (
                "Historial de mildiu. Aumentar vigilancia y considerar tratamiento preventivo."
            ),
            "tratamientos_sugeridos": ["Fosetil-Al"]
        })

    if "botritis" in historial and tipo == "humedad":
        recomendaciones.append({
            "tipo": "refuerzo_prevencion",
            "riesgo": riesgo,
            "objetivo": "botritis",
            "mensaje": (
                "Historial de botritis. Revisar zonas densas y frutos en contacto."
            ),
            "tratamientos_sugeridos": ["Ciprodinil"]
        })

    # ============================================================
    # 🌱 SENSIBILIDAD DEL CULTIVO → manejo adaptado
    # ============================================================
    if sensibilidad == "alta" and riesgo in ["medium", "high"]:
        recomendaciones.append({
            "tipo": "manejo_sensible",
            "riesgo": riesgo,
            "objetivo": "proteccion_general",
            "mensaje": (
                "Cultivo con sensibilidad alta. Ajustar manejo para reducir estrés y daños."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🌿 DENSIDAD ALTA → riesgo de hongos
    # ============================================================
    if densidad == "alta" and tipo in ["humedad", "lluvia"]:
        recomendaciones.append({
            "tipo": "manejo_densidad",
            "riesgo": riesgo,
            "objetivo": "hongos_foliares",
            "mensaje": (
                "Densidad alta de plantación. Mayor riesgo de hongos por falta de ventilación."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🔧 MANEJO PREVIO → estrés acumulado
    # ============================================================
    if manejo == "estresado" and riesgo in ["medium", "high"]:
        recomendaciones.append({
            "tipo": "recuperacion",
            "riesgo": riesgo,
            "objetivo": "estres_acumulado",
            "mensaje": (
                "El cultivo ya presentaba estrés previo. Evitar labores agresivas y priorizar recuperación."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
