def reglas_plagas(evento_clima, cultivo, contexto):
    recomendaciones = []

    # Ejemplo: humedad alta favorece mildiu
    if evento_clima.type == "lluvia" and evento_clima.risk_level in ["medium", "high"]:
        if "mildiu" in cultivo.plagas_comunes:
            recomendaciones.append({
                "tipo": "prevencion_plagas",
                "mensaje": "Condiciones favorables para mildiu. Aplica preventivo si es necesario.",
            })

    return recomendaciones
