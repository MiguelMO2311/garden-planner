# agro_rules/humedad.py

def reglas_humedad(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en humedad relativa.
    - evento_clima: objeto con .type, .risk_level, .intensity (% HR)
    - cultivo: objeto CultivoParcela con .cultivo_tipo.nombre
    - contexto: dict opcional (fase, historial, suelo, ventilación)
    """

    recomendaciones = []

    if evento_clima.type != "humedad":
        return recomendaciones

    riesgo = evento_clima.risk_level
    humedad = evento_clima.intensity  # %
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"

    fase = contexto.get("fase") if contexto else None
    historial = contexto.get("historial") if contexto else None
    ventilacion = contexto.get("ventilacion") if contexto else None
    suelo = contexto.get("suelo") if contexto else None

    # ============================================================
    # 🌫 HUMEDAD MUY ALTA (riesgo alto)
    # ============================================================
    if riesgo == "high":

        # Mildiu + Botritis
        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "riesgo": "alto",
            "objetivo": "mildiu_botritis",
            "mensaje": (
                f"Humedad muy alta ({humedad}%). Condiciones críticas para mildiu y botritis en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": ["Fosetil-Al", "Ciprodinil", "Fludioxonil"]
        })

        # Ventilación deficiente → riesgo extremo
        if ventilacion == "mala":
            recomendaciones.append({
                "tipo": "mejora_ventilacion",
                "riesgo": "alto",
                "objetivo": "mildiu",
                "mensaje": (
                    "Ventilación deficiente detectada. Abrir laterales o aumentar renovación de aire."
                ),
                "tratamientos_sugeridos": []
            })

        # Historial de mildiu → reforzar
        if historial and "mildiu" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_prevencion",
                "riesgo": "alto",
                "objetivo": "mildiu",
                "mensaje": (
                    "Historial previo de mildiu. Se recomienda tratamiento preventivo inmediato."
                ),
                "tratamientos_sugeridos": ["Fosetil-Al"]
            })

        # Suelo arcilloso → más condensación
        if suelo == "arcilloso":
            recomendaciones.append({
                "tipo": "riesgo_suelo",
                "riesgo": "alto",
                "objetivo": "botritis",
                "mensaje": (
                    "El suelo arcilloso retiene humedad. Mayor riesgo de botritis en zonas bajas."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 🌫 HUMEDAD ELEVADA (riesgo medio)
    # ============================================================
    if riesgo == "medium":

        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "riesgo": "medio",
            "objetivo": "mildiu",
            "mensaje": (
                f"Humedad elevada ({humedad}%). Condiciones favorables para mildiu en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": ["Fosetil-Al", "Metalaxil-M"]
        })

        # Fase crítica → riesgo mayor
        if fase in ["floracion", "cuajado"]:
            recomendaciones.append({
                "tipo": "fase_critica",
                "riesgo": "medio",
                "objetivo": "botritis",
                "mensaje": (
                    f"Humedad elevada durante {fase}. Riesgo de botritis en flores y frutos jóvenes."
                ),
                "tratamientos_sugeridos": ["Ciprodinil"]
            })

        # Historial → reforzar vigilancia
        if historial and "botritis" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_vigilancia",
                "riesgo": "medio",
                "objetivo": "botritis",
                "mensaje": (
                    "Historial de botritis. Revisar zonas densas y frutos en contacto."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 🌫 HUMEDAD MODERADA (riesgo bajo)
    # ============================================================
    if riesgo == "low":

        recomendaciones.append({
            "tipo": "vigilancia",
            "riesgo": "bajo",
            "objetivo": "hongos_foliares",
            "mensaje": (
                f"Humedad moderada ({humedad}%). Vigilar aparición de oídio y alternaria."
            ),
            "tratamientos_sugeridos": ["Azufre mojable", "Penconazol"]
        })

    return recomendaciones
