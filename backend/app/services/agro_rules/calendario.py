def reglas_calendario(evento_clima, cultivo, contexto):
    recomendaciones = []

    dias = contexto.get("dias_desde_siembra", 0)

    # Ejemplo: tomate
    if cultivo.name == "Tomate":
        if dias == 30:
            recomendaciones.append({
                "tipo": "poda",
                "mensaje": "El tomate cumple 30 días. Realiza poda de brotes.",
            })
        if dias == 60:
            recomendaciones.append({
                "tipo": "abonado",
                "mensaje": "Momento ideal para primer abonado del tomate.",
            })

    return recomendaciones
