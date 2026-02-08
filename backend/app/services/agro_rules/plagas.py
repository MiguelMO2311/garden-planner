# agro_rules/plagas.py

def reglas_plagas(evento_clima, cultivo, contexto=None):
    """
    Reglas sanitarias basadas en condiciones climáticas que favorecen plagas.
    - evento_clima: objeto con .type, .risk_level, .intensity
    - cultivo: objeto CultivoParcela con .cultivo_tipo.nombre y .plagas_comunes (lista)
    - contexto: dict opcional (fase, historial, suelo, manejo)
    """

    recomendaciones = []

    tipo = evento_clima.type
    riesgo = evento_clima.risk_level
    intensidad = evento_clima.intensity
    nombre_cultivo = cultivo.cultivo_tipo.nombre if cultivo.cultivo_tipo else "cultivo"

    plagas_comunes = getattr(cultivo, "plagas_comunes", []) or []

    fase = contexto.get("fase") if contexto else None
    historial = contexto.get("historial") if contexto else None
    suelo = contexto.get("suelo") if contexto else None

    # ============================================================
    # 🌫 HUMEDAD ALTA → mildiu, botritis, trips (por descomposición)
    # ============================================================
    if tipo == "humedad" and riesgo in ["medium", "high"]:

        # Mildiu
        if "mildiu" in plagas_comunes:
            recomendaciones.append({
                "tipo": "prevencion_hongos",
                "riesgo": riesgo,
                "objetivo": "mildiu",
                "mensaje": (
                    f"Humedad elevada ({intensidad}%). Condiciones favorables para mildiu en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Fosetil-Al", "Metalaxil-M"]
            })

        # Botritis
        if "botritis" in plagas_comunes and riesgo == "high":
            recomendaciones.append({
                "tipo": "prevencion_hongos",
                "riesgo": "alto",
                "objetivo": "botritis",
                "mensaje": (
                    f"Humedad muy alta ({intensidad}%). Riesgo elevado de botritis en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Ciprodinil", "Fludioxonil"]
            })

    # ============================================================
    # 🌧 LLUVIA → mildiu, bacteriosis, hongos foliares
    # ============================================================
    if tipo == "lluvia" and riesgo in ["medium", "high"]:

        if "mildiu" in plagas_comunes:
            recomendaciones.append({
                "tipo": "prevencion_hongos",
                "riesgo": riesgo,
                "objetivo": "mildiu",
                "mensaje": (
                    f"Lluvia {riesgo}. Condiciones favorables para mildiu en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Fosetil-Al", "Metalaxil-M"]
            })

        if "bacteriosis" in plagas_comunes and riesgo == "high":
            recomendaciones.append({
                "tipo": "prevencion_bacterias",
                "riesgo": "alto",
                "objetivo": "bacteriosis",
                "mensaje": (
                    f"Lluvia intensa. Riesgo alto de bacteriosis en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Cobre hidróxido", "Cobre oxicloruro"]
            })

    # ============================================================
    # 🔥 CALOR → araña roja, mosca blanca, trips
    # ============================================================
    if tipo in ["ola_de_calor", "calor_extremo"]:

        # Araña roja
        if "arana_roja" in plagas_comunes and riesgo in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "prevencion_plagas",
                "riesgo": riesgo,
                "objetivo": "arana_roja",
                "mensaje": (
                    f"Calor {riesgo}. Condiciones favorables para araña roja en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Abamectina", "Spiromesifen"]
            })

        # Mosca blanca
        if "mosca_blanca" in plagas_comunes and riesgo == "high":
            recomendaciones.append({
                "tipo": "prevencion_plagas",
                "riesgo": "alto",
                "objetivo": "mosca_blanca",
                "mensaje": (
                    f"Calor extremo. Riesgo alto de mosca blanca en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Piretrinas naturales", "Azadiractina"]
            })

        # Trips
        if "trips" in plagas_comunes and riesgo in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "prevencion_plagas",
                "riesgo": riesgo,
                "objetivo": "trips",
                "mensaje": (
                    f"Calor {riesgo}. Condiciones favorables para trips en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Spinosad", "Spinetoram"]
            })

    # ============================================================
    # 💨 VIENTO → pulgón (dispersión), trips
    # ============================================================
    if tipo in ["viento_fuerte", "viento_muy_fuerte"]:

        if "pulgon" in plagas_comunes and riesgo in ["medium", "high"]:
            recomendaciones.append({
                "tipo": "vigilancia_plagas",
                "riesgo": riesgo,
                "objetivo": "pulgon",
                "mensaje": (
                    f"Viento fuerte. Mayor dispersión de pulgón en {nombre_cultivo}."
                ),
                "tratamientos_sugeridos": ["Piretrinas naturales"]
            })

        if "trips" in plagas_comunes and riesgo == "high":
            recomendaciones.append({
                "tipo": "vigilancia_plagas",
                "riesgo": "alto",
                "objetivo": "trips",
                "mensaje": (
                    "Viento muy fuerte. Riesgo de entrada de trips desde parcelas vecinas."
                ),
                "tratamientos_sugeridos": ["Spinosad"]
            })

    return recomendaciones
