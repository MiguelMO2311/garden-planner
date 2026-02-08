def reglas_calor(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en olas de calor.
    - evento_clima: objeto con .type, .risk_level, .intensity (ºC)
    - cultivo: objeto CultivoParcela con .cultivo_tipo.nombre y .sensibilidad_calor
    - contexto: dict opcional (fase, suelo, historial, riego)
    """

    recomendaciones = []

    if evento_clima.type not in ["ola_de_calor", "calor_extremo"]:
        return recomendaciones

    riesgo = evento_clima.risk_level
    temperatura = evento_clima.intensity
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"
    sensibilidad = getattr(cultivo, "sensibilidad_calor", "medium")

    fase = contexto.get("fase") if contexto else None
    suelo = contexto.get("suelo") if contexto else None
    historial = contexto.get("historial") if contexto else None

    # ============================================================
    # 🔥 CALOR EXTREMO (riesgo alto)
    # ============================================================
    if riesgo == "high":

        # Estrés hídrico severo
        recomendaciones.append({
            "tipo": "riego_extra",
            "riesgo": "alto",
            "objetivo": "estres_hidrico",
            "mensaje": (
                f"Calor extremo ({temperatura}°C). Aumentar el riego un 20–30% en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": []
        })

        # Cultivos sensibles → sombreo obligatorio
        if sensibilidad == "high":
            recomendaciones.append({
                "tipo": "sombra",
                "riesgo": "alto",
                "objetivo": "proteccion_solar",
                "mensaje": (
                    f"{nombre_cultivo} es muy sensible al calor. Instalar sombreo temporal o malla de sombreo."
                ),
                "tratamientos_sugeridos": []
            })

        # Fase crítica → riesgo extremo
        if fase in ["floracion", "cuajado"]:
            recomendaciones.append({
                "tipo": "fase_critica",
                "riesgo": "alto",
                "objetivo": "abortos_florales",
                "mensaje": (
                    f"Calor extremo durante {fase}. Riesgo muy alto de caída de flor y aborto de fruto."
                ),
                "tratamientos_sugeridos": []
            })

        # Suelo arenoso → riego más frecuente
        if suelo == "arenoso":
            recomendaciones.append({
                "tipo": "ajuste_riego",
                "riesgo": "alto",
                "objetivo": "estres_hidrico",
                "mensaje": (
                    "El suelo arenoso drena rápido. Aumentar frecuencia de riego en días de calor extremo."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 🔥 OLA DE CALOR MODERADA (riesgo medio)
    # ============================================================
    if riesgo == "medium":

        recomendaciones.append({
            "tipo": "sombra",
            "riesgo": "medio",
            "objetivo": "proteccion_solar",
            "mensaje": (
                f"Ola de calor moderada ({temperatura}°C). Considerar sombrear {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": []
        })

        # Cultivos sensibles → riego ajustado
        if sensibilidad in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "riego_ajustado",
                "riesgo": "medio",
                "objetivo": "estres_hidrico",
                "mensaje": (
                    f"{nombre_cultivo} es sensible al calor. Ajustar riego para evitar estrés hídrico."
                ),
                "tratamientos_sugeridos": []
            })

        # Historial de quemaduras → reforzar
        if historial and "quemaduras" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_prevencion",
                "riesgo": "medio",
                "objetivo": "quemaduras_solares",
                "mensaje": (
                    "Historial de quemaduras solares. Aumentar sombreo y revisar hojas expuestas."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 🔥 CALOR SUAVE (riesgo bajo)
    # ============================================================
    if riesgo == "low":
        recomendaciones.append({
            "tipo": "vigilancia",
            "riesgo": "bajo",
            "objetivo": "estres_hidrico",
            "mensaje": (
                f"Temperaturas elevadas ({temperatura}°C). Vigilar marchitez en horas centrales."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
