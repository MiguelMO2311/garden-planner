# app/seeds/seed_frutales.py

from app.core.database import SessionLocal
from app.models.cultivo_tipo import CultivoTipo

def run(user_id: int = 2):
    db = SessionLocal()

    variedades = [

        # ============================================================
        # MANZANOS — VARIEDADES ESPAÑOLAS
        # ============================================================

        {
            "nombre": "Manzano Reineta Blanca",
            "nombre_latin": "Malus domestica",
            "variedad": "Reineta Blanca",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 180,
            "litros_agua_semana": 20,
            "fase_lunar": "Creciente",
            "plagas": ["Carpocapsa", "Pulgón"],
            "enfermedades": ["Moteado", "Roya"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 20,
            "temperatura_minima": -10,
            "temperatura_optima": 20,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Alta",
            "notas": "Muy típica en el norte de España; sabor ácido y aromático."
        },
        {
            "nombre": "Manzano Reineta Gris",
            "nombre_latin": "Malus domestica",
            "variedad": "Reineta Gris",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 185,
            "litros_agua_semana": 20,
            "fase_lunar": "Creciente",
            "plagas": ["Carpocapsa"],
            "enfermedades": ["Moteado"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 20,
            "temperatura_minima": -10,
            "temperatura_optima": 20,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Alta",
            "notas": "Muy usada en repostería; típica de Castilla y León."
        },
        {
            "nombre": "Manzano Verde Doncella",
            "nombre_latin": "Malus domestica",
            "variedad": "Verde Doncella",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 170,
            "litros_agua_semana": 18,
            "fase_lunar": "Creciente",
            "plagas": ["Pulgón"],
            "enfermedades": ["Roya"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -8,
            "temperatura_optima": 20,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy dulce; típica de Aragón y Navarra."
        },

        # ============================================================
        # PERALES — VARIEDADES ESPAÑOLAS
        # ============================================================

        {
            "nombre": "Peral Conferencia",
            "nombre_latin": "Pyrus communis",
            "variedad": "Conferencia",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 160,
            "litros_agua_semana": 18,
            "fase_lunar": "Creciente",
            "plagas": ["Psylla", "Pulgón"],
            "enfermedades": ["Fuego bacteriano"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 20,
            "temperatura_minima": -8,
            "temperatura_optima": 22,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy cultivada en La Rioja y Aragón."
        },
        {
            "nombre": "Peral Ercolini",
            "nombre_latin": "Pyrus communis",
            "variedad": "Ercolini",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 150,
            "litros_agua_semana": 17,
            "fase_lunar": "Creciente",
            "plagas": ["Pulgón"],
            "enfermedades": ["Roya"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -6,
            "temperatura_optima": 22,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy típica en Murcia y Valencia."
        },

        # ============================================================
        # MELOCOTONEROS — VARIEDADES ESPAÑOLAS
        # ============================================================

        {
            "nombre": "Melocotón de Calanda",
            "nombre_latin": "Prunus persica",
            "variedad": "Calanda",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 150,
            "litros_agua_semana": 20,
            "fase_lunar": "Creciente",
            "plagas": ["Mosca de la fruta"],
            "enfermedades": ["Abolladura"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 20,
            "temperatura_minima": -5,
            "temperatura_optima": 25,
            "exigencia_hidrica": "Alta",
            "exigencia_nutrientes": "Alta",
            "notas": "Muy famoso por su dulzor; protegido con embolsado."
        },
        {
            "nombre": "Melocotón Amarillo de Murcia",
            "nombre_latin": "Prunus persica",
            "variedad": "Murcia Amarillo",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 140,
            "litros_agua_semana": 18,
            "fase_lunar": "Creciente",
            "plagas": ["Pulgón"],
            "enfermedades": ["Abolladura"],
            "plazo_seguridad": 14,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -4,
            "temperatura_optima": 25,
            "exigencia_hidrica": "Alta",
            "exigencia_nutrientes": "Media",
            "notas": "Muy cultivado en Murcia; frutos grandes y aromáticos."
        },

        # ============================================================
        # CIRUELOS — VARIEDADES ESPAÑOLAS
        # ============================================================

        {
            "nombre": "Ciruela Claudia Verde",
            "nombre_latin": "Prunus domestica",
            "variedad": "Claudia Verde",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 130,
            "litros_agua_semana": 16,
            "fase_lunar": "Creciente",
            "plagas": ["Mosca de la fruta"],
            "enfermedades": ["Monilia"],
            "plazo_seguridad": 10,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -6,
            "temperatura_optima": 24,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy dulce; típica de Aragón."
        },
        {
            "nombre": "Ciruela Reina Claudia Amarilla",
            "nombre_latin": "Prunus domestica",
            "variedad": "Claudia Amarilla",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 135,
            "litros_agua_semana": 16,
            "fase_lunar": "Creciente",
            "plagas": ["Pulgón"],
            "enfermedades": ["Monilia"],
            "plazo_seguridad": 10,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -6,
            "temperatura_optima": 24,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy aromática; típica de La Rioja."
        },

        # ============================================================
        # ALBARICOQUEROS — VARIEDADES ESPAÑOLAS
        # ============================================================

        {
            "nombre": "Albaricoque Búlida",
            "nombre_latin": "Prunus armeniaca",
            "variedad": "Búlida",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 120,
            "litros_agua_semana": 15,
            "fase_lunar": "Creciente",
            "plagas": ["Mosca de la fruta"],
            "enfermedades": ["Monilia"],
            "plazo_seguridad": 10,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -4,
            "temperatura_optima": 24,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy típico de Murcia y Valencia."
        },
        {
            "nombre": "Albaricoque Canino",
            "nombre_latin": "Prunus armeniaca",
            "variedad": "Canino",
            "tipo": "Frutal",
            "temporada_optima": "Primavera",
            "dias_crecimiento": 115,
            "litros_agua_semana": 15,
            "fase_lunar": "Creciente",
            "plagas": ["Pulgón"],
            "enfermedades": ["Monilia"],
            "plazo_seguridad": 10,
            "frecuencia_tratamiento": 18,
            "temperatura_minima": -4,
            "temperatura_optima": 24,
            "exigencia_hidrica": "Media",
            "exigencia_nutrientes": "Media",
            "notas": "Muy dulce; típico de la costa mediterránea."
        }
    ]

    for c in variedades:
        cultivo = CultivoTipo(**c, user_id=user_id)
        db.add(cultivo)

    db.commit()
    db.close()

    print(">>> Seed de frutales insertado correctamente.")
