def reglas_helada(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en heladas.
    - evento_clima: objeto con .type, .risk_level, .intensity (ºC)
    - cultivo: objeto CultivoParcela con .sensibilidad_helada y .cultivo_tipo.nombre
    - contexto: dict opcional (fase, historial, suelo, manejo)
    """

    recomendaciones = []

    if evento_clima.type != "helada":
        return recomendaciones

    riesgo = evento_clima.risk_level
    temperatura = evento_clima.intensity  # ºC
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"
    sensibilidad = getattr(cultivo, "sensibilidad_helada", "medium")

    fase = contexto.get("fase") if contexto else None
    historial = contexto.get("historial") if contexto else None
    suelo = contexto.get("suelo") if contexto else None

    # ============================================================
    # ❄ HELADA SEVERA (riesgo alto)
    # ============================================================
    if riesgo == "high":

        # Cultivo muy sensible → protección inmediata
        if sensibilidad == "high":
            recomendaciones.append({
                "tipo": "proteccion",
                "riesgo": "alto",
                "objetivo": "daño_helada",
                "mensaje": (
                    f"Helada severa ({temperatura}°C) y {nombre_cultivo} muy sensible. "
                    "Aplicar manta térmica o protección inmediata."
                ),
                "tratamientos_sugeridos": []
            })

        # Fase crítica → riesgo extremo
        if fase in ["floracion", "cuajado"]:
            recomendaciones.append({
                "tipo": "fase_critica",
                "riesgo": "alto",
                "objetivo": "daño_floral",
                "mensaje": (
                    f"Helada severa durante {fase}. Riesgo muy alto de pérdida de flor o fruto."
                ),
                "tratamientos_sugeridos": []
            })

        # Suelo arcilloso → más daño por frío
        if suelo == "arcilloso":
            recomendaciones.append({
                "tipo": "riesgo_suelo",
                "riesgo": "alto",
                "objetivo": "daño_radicular",
                "mensaje": (
                    "El suelo arcilloso retiene más humedad y enfría más rápido. "
                    "Riesgo elevado de daño radicular."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # ❄ HELADA LIGERA (riesgo medio)
    # ============================================================
    if riesgo == "medium":

        if sensibilidad in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "revision",
                "riesgo": "medio",
                "objetivo": "daño_helada",
                "mensaje": (
                    f"Helada ligera ({temperatura}°C). Revisar daños en brotes tiernos de {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": []
            })

        # Historial de daños → reforzar vigilancia
        if historial and "helada" in historial:
            recomendaciones.append({
                "tipo": "refuerzo_vigilancia",
                "riesgo": "medio",
                "objetivo": "daño_helada",
                "mensaje": (
                    "Historial previo de daños por helada. Aumentar vigilancia en tejidos jóvenes."
                ),
                "tratamientos_sugeridos": []
            })

    # ============================================================
    # ❄ HELADA SUAVE (riesgo bajo)
    # ============================================================
    if riesgo == "low":
        recomendaciones.append({
            "tipo": "vigilancia",
            "riesgo": "bajo",
            "objetivo": "daño_helada",
            "mensaje": (
                f"Temperaturas cercanas a 0°C. Vigilar hojas nuevas y brotes sensibles."
            ),
            "tratamientos_sugeridos": []
        })

    return recomendaciones
