def reglas_helada(evento_clima, cultivo, contexto):
    recomendaciones = []

    if evento_clima.type != "helada":
        return recomendaciones

    sensibilidad = cultivo.sensibilidad_helada

    if evento_clima.risk_level == "high" and sensibilidad == "high":
        recomendaciones.append({
            "tipo": "proteccion",
            "mensaje": "Helada severa y cultivo muy sensible. Usa manta térmica.",
        })

    if evento_clima.risk_level == "medium" and sensibilidad in ["medium", "high"]:
        recomendaciones.append({
            "tipo": "revision",
            "mensaje": "Helada ligera. Revisa daños en brotes tiernos.",
        })

    return recomendaciones
