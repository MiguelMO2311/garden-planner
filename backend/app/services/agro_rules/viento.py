def reglas_viento(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en viento fuerte.
    - evento_clima: objeto con .type, .risk_level, .intensity (km/h)
    - cultivo: objeto CultivoParcela con .cultivo_tipo.nombre y .sensibilidad_viento
    - contexto: dict opcional (fase, suelo, historial, estructura)
    """

    recomendaciones = []

    if evento_clima.type not in ["viento_fuerte", "viento_muy_fuerte", "viento_moderado"]:
        return recomendaciones

    riesgo = evento_clima.risk_level
    velocidad = evento_clima.intensity  # km/h
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"
    sensibilidad = getattr(cultivo, "sensibilidad_viento", "medium")

    fase = contexto.get("fase") if contexto else None
    historial = contexto.get("historial") if contexto else None
    estructura = contexto.get("estructura") if contexto else None  # invernadero, tutorado, espaldera

    # ============================================================
    # 💨 VIENTO MUY FUERTE (riesgo alto)
    # ============================================================
    if riesgo == "high":

        # Entutorado obligatorio
        recomendaciones.append({
            "tipo": "entutorado",
            "riesgo": "alto",
            "objetivo": "roturas",
            "mensaje": (
                f"Viento muy fuerte ({velocidad} km/h). Entutorar o reforzar soporte en {nombre_cultivo}."
            ),
            "tratamientos_sugeridos": []
        })

        # Cultivos sensibles → riesgo extremo
        if sensibilidad == "high":
            recomendaciones.append({
                "tipo": "proteccion_estructural",
                "riesgo": "alto",
                "objetivo": "roturas",
                "mensaje": (
                    f"{nombre_cultivo} es muy sensible al viento. Riesgo alto de roturas y caída de frutos."
                ),
                "tratamientos_sugeridos": []
            })

        # Fase crítica → caída de frutos
        if fase in ["cuajado", "engorde"]:
            recomendaciones.append({
                "tipo": "fase_critica",
                "riesgo": "alto",
                "objetivo": "caida_frutos",
                "mensaje": (
                    f"Viento muy fuerte durante {fase}. Riesgo elevado de caída de frutos."
                ),
                "tratamientos_sugeridos": []
            })

        # Invernadero → riesgo de daños estructurales
        if estructura == "invernadero":
            recomendaciones.append({
                "tipo": "revision_estructura",
                "riesgo": "alto",
                "objetivo": "daño_estructural",
                "mensaje": (
                    "Revisar tensores y plásticos del invernadero. Riesgo de roturas por viento fuerte."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 💨 VIENTO FUERTE (riesgo medio)
    # ============================================================
    if riesgo == "medium":

        recomendaciones.append({
            "tipo": "revision",
            "riesgo": "medio",
            "objetivo": "daño_mecanico",
            "mensaje": (
                f"Viento fuerte ({velocidad} km/h). Revisar hojas desgarradas y tallos doblados."
            ),
            "tratamientos_sugeridos": []
        })

        # Cultivos sensibles → entutorado preventivo
        if sensibilidad in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "entutorado_preventivo",
                "riesgo": "medio",
                "objetivo": "roturas",
                "mensaje": (
                    f"{nombre_cultivo} es sensible al viento. Reforzar entutorado para evitar roturas."
                ),
                "tratamientos_sugeridos": []
            })

        # Historial de daños → reforzar vigilancia
        if historial and "viento" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_vigilancia",
                "riesgo": "medio",
                "objetivo": "daño_mecanico",
                "mensaje": (
                    "Historial previo de daños por viento. Revisar zonas expuestas."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # 💨 VIENTO MODERADO (riesgo bajo)
    # ============================================================
    if riesgo == "low":
        recomendaciones.append({
            "tipo": "vigilancia",
            "riesgo": "bajo",
            "objetivo": "deshidratacion",
            "mensaje": (
                f"Viento moderado ({velocidad} km/h). Vigilar deshidratación foliar en horas de sol."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
