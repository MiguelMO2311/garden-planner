def reglas_lluvia(evento_clima, cultivo, contexto):
    recomendaciones = []

    lluvia = evento_clima.intensity
    riesgo = evento_clima.risk_level

    # 🌧 Lluvia fuerte → hongos
    if evento_clima.type == "lluvia" and riesgo == "medium":
        recomendaciones.append({
            "tipo": "prevencion_hongos",
            "mensaje": "Lluvia fuerte reciente. Revisa signos de mildiu u oídio.",
        })

    # 🌧 Lluvia muy intensa → anegamiento
    if evento_clima.type == "lluvia" and riesgo == "high":
        recomendaciones.append({
            "tipo": "drenaje",
            "mensaje": "Lluvia muy intensa. Revisa drenaje y evita encharcamientos.",
        })

    return recomendaciones