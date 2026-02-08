# agro_rules/fenologia.py

def reglas_fenologia(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en la fase fenológica del cultivo.
    - evento_clima: objeto con .type, .risk_level, .intensity
    - cultivo: objeto CultivoParcela
    - contexto: dict opcional con:
        - fase: "brotacion", "floracion", "cuajado", "engorde", "maduracion"
        - historial: lista de enfermedades previas
    """

    recomendaciones = []

    if not contexto:
        return recomendaciones

    fase = contexto.get("fase")
    historial = contexto.get("historial") or []

    tipo = evento_clima.type
    riesgo = evento_clima.risk_level
    intensidad = evento_clima.intensity

    # ============================================================
    # ❄ HELADA DURANTE FLORACIÓN → daño floral severo
    # ============================================================
    if tipo == "helada" and fase == "floracion":
        recomendaciones.append({
            "tipo": "proteccion",
            "riesgo": riesgo,
            "objetivo": "daño_floral",
            "mensaje": (
                "Helada durante floración. Riesgo elevado de pérdida de flor y reducción del cuajado."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🔥 CALOR DURANTE CUAJADO → aborto de fruto
    # ============================================================
    if tipo in ["ola_de_calor", "calor_extremo"] and fase == "cuajado":
        recomendaciones.append({
            "tipo": "sombra",
            "riesgo": riesgo,
            "objetivo": "abortos_florales",
            "mensaje": (
                "Calor intenso durante cuajado. Riesgo de aborto de fruto y caída prematura."
            ),
            "tratamientos_sugeridos": []
        })

    # ============================================================
    # 🌫 HUMEDAD DURANTE FLORACIÓN → botritis
    # ============================================================
    if tipo == "humedad" and fase == "floracion" and riesgo in ["medium", "high"]:
        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "riesgo": riesgo,
            "objetivo": "botritis",
            "mensaje": (
                "Humedad elevada durante floración. Condiciones favorables para botritis."
            ),
            "tratamientos_sugeridos": ["Ciprodinil"]
        })

    # ============================================================
    # 💨 VIENTO DURANTE ENGORDE → caída de frutos
    # ============================================================
    if tipo in ["viento_fuerte", "viento_muy_fuerte"] and fase == "engorde":
        recomendaciones.append({
            "tipo": "entutorado",
            "riesgo": riesgo,
            "objetivo": "caida_frutos",
            "mensaje": (
                "Viento fuerte durante engorde. Riesgo de caída de frutos y daños mecánicos."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
