def reglas_calor(evento_clima, cultivo, contexto):
    recomendaciones = []

    if evento_clima.type != "ola_de_calor":
        return recomendaciones

    if evento_clima.risk_level == "high":
        recomendaciones.append({
            "tipo": "riego_extra",
            "mensaje": "Ola de calor extrema. Aumenta el riego un 20%.",
        })

    if evento_clima.risk_level == "medium":
        recomendaciones.append({
            "tipo": "sombra",
            "mensaje": "Ola de calor moderada. Considera sombrear cultivos sensibles.",
        })

    return recomendaciones
