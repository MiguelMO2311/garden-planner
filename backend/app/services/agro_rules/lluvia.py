# agro_rules/lluvia.py

def reglas_lluvia(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en lluvia reciente.
    - evento_clima: objeto con .type, .intensity, .risk_level
    - cultivo: objeto CultivoParcela con .cultivo_tipo.nombre
    - contexto: dict opcional (suelo, drenaje, historial, sensibilidad)
    """

    recomendaciones = []

    tipo = evento_clima.type
    intensidad = evento_clima.intensity
    riesgo = evento_clima.risk_level
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"

    suelo = contexto.get("suelo") if contexto else None
    drenaje = contexto.get("drenaje") if contexto else None
    historial = contexto.get("historial") if contexto else None

    # ============================================================
    # 🌧 LLUVIA LIGERA → hongos superficiales
    # ============================================================
    if tipo == "lluvia" and riesgo == "low":
        recomendaciones.append({
            "tipo": "vigilancia",
            "riesgo": "bajo",
            "objetivo": "hongos_foliares",
            "mensaje": (
                f"Lluvia ligera ({intensidad} mm). Vigilar aparición de oídio, alternaria o manchas foliares "
                f"en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": ["Azufre mojable", "Penconazol"]
        })

    # ============================================================
    # 🌧 LLUVIA MODERADA → riesgo de mildiu
    # ============================================================
    if tipo == "lluvia" and riesgo == "medium":
        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "riesgo": "medio",
            "objetivo": "mildiu",
            "mensaje": (
                f"Lluvia moderada detectada ({intensidad} mm). Condiciones favorables para mildiu en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": ["Fosetil-Al", "Metalaxil-M"]
        })

        # Si el cultivo es sensible, reforzar recomendación
        if nombre_cultivo.lower() in ["vid", "tomate", "patata", "pepino"]:
            recomendaciones.append({
                "tipo": "refuerzo_prevencion",
                "riesgo": "medio",
                "objetivo": "mildiu",
                "mensaje": (
                    f"{nombre_cultivo} es especialmente sensible al mildiu. Se recomienda aumentar vigilancia "
                    f"tras lluvia moderada."
                ),
                "tratamientos_sugeridos": ["Fosetil-Al"]
            })

    # ============================================================
    # 🌧 LLUVIA INTENSA → mildiu + botritis + anegamiento
    # ============================================================
    if tipo == "lluvia" and riesgo == "high":

        # Mildiu + Botritis
        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "riesgo": "alto",
            "objetivo": "mildiu_botritis",
            "mensaje": (
                f"Lluvia intensa ({intensidad} mm). Riesgo alto de mildiu y botritis en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": ["Fosetil-Al", "Ciprodinil", "Fludioxonil"]
        })

        # Anegamiento
        recomendaciones.append({
            "tipo": "drenaje",
            "riesgo": "alto",
            "objetivo": "anegamiento",
            "mensaje": (
                "Revisar drenaje en la parcela. Evitar encharcamientos prolongados tras lluvia intensa."
            ),
            "tratamientos_sugeridos": []
        })

        # Si el suelo es arcilloso → riesgo crítico
        if suelo == "arcilloso":
            recomendaciones.append({
                "tipo": "riesgo_suelo",
                "riesgo": "alto",
                "objetivo": "anegamiento",
                "mensaje": (
                    "El suelo arcilloso retiene agua. Riesgo MUY ALTO de asfixia radicular tras lluvia intensa."
                ),
                "tratamientos_sugeridos": []
            })

        # Si hay historial de mildiu → reforzar
        if historial and "mildiu" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_prevencion",
                "riesgo": "alto",
                "objetivo": "mildiu",
                "mensaje": (
                    "Historial previo de mildiu detectado. Se recomienda tratamiento preventivo inmediato."
                ),
                "tratamientos_sugeridos": ["Fosetil-Al"]
            })

    return recomendaciones
