def reglas_viento(evento_clima, cultivo, contexto):
    recomendaciones = []

    if evento_clima.type != "viento_fuerte":
        return recomendaciones

    if evento_clima.risk_level == "high":
        recomendaciones.append({
            "tipo": "entutorado",
            "mensaje": "Viento muy fuerte. Entutora plantas altas o frágiles.",
        })

    if evento_clima.risk_level == "medium":
        recomendaciones.append({
            "tipo": "revision",
            "mensaje": "Viento fuerte. Revisa posibles daños en hojas.",
        })

    return recomendaciones
