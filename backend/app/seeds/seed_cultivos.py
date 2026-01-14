import json
from app.core.database import SessionLocal
from app.models.cultivo_tipo import CultivoTipo

db = SessionLocal()

cultivos = []

# ---------------------------------------------------------
# CULTIVOS DE FRUTO — Datos reales
# ---------------------------------------------------------

cultivos_fruto = [
    {
        "nombre": "Tomate",
        "nombre_latin": "Solanum lycopersicum",
        "variedad": "Raff",
        "tipo": "Fruto",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 90,
        "litros_agua_semana": 12,
        "fase_lunar": "Creciente",
        "plagas": ["Mosca blanca", "Tuta absoluta", "Pulgón", "Araña roja"],
        "enfermedades": ["Mildiu", "Oídio", "Botrytis"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 15,
        "temperatura_minima": 10,
        "temperatura_optima": 24,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Alta",
        "notas": "Requiere tutorado, poda y riego constante."
    },
    {
        "nombre": "Pimiento",
        "nombre_latin": "Capsicum annuum",
        "variedad": "California Wonder",
        "tipo": "Fruto",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 75,
        "litros_agua_semana": 10,
        "fase_lunar": "Creciente",
        "plagas": ["Trips", "Pulgón", "Araña roja"],
        "enfermedades": ["Mildiu", "Oídio"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 12,
        "temperatura_optima": 26,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Alta",
        "notas": "Sensibles al frío; requieren suelos bien drenados."
    },
    {
        "nombre": "Berenjena",
        "nombre_latin": "Solanum melongena",
        "variedad": "Black Beauty",
        "tipo": "Fruto",
        "temporada_optima": "Verano",
        "dias_crecimiento": 80,
        "litros_agua_semana": 10,
        "fase_lunar": "Creciente",
        "plagas": ["Araña roja", "Pulgón"],
        "enfermedades": ["Verticillium", "Mildiu"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 15,
        "temperatura_optima": 28,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Alta",
        "notas": "Muy exigente en calor; evitar encharcamientos."
    },
    {
        "nombre": "Pepino",
        "nombre_latin": "Cucumis sativus",
        "variedad": "Marketmore",
        "tipo": "Fruto",
        "temporada_optima": "Verano",
        "dias_crecimiento": 55,
        "litros_agua_semana": 14,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Trips"],
        "enfermedades": ["Oídio", "Mildiu"],
        "plazo_seguridad": 3,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 12,
        "temperatura_optima": 25,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Media",
        "notas": "Requiere humedad constante y acolchado."
    },
    {
        "nombre": "Calabacín",
        "nombre_latin": "Cucurbita pepo",
        "variedad": "Black Beauty",
        "tipo": "Fruto",
        "temporada_optima": "Verano",
        "dias_crecimiento": 50,
        "litros_agua_semana": 12,
        "fase_lunar": "Creciente",
        "plagas": ["Mosca blanca", "Pulgón"],
        "enfermedades": ["Oídio"],
        "plazo_seguridad": 3,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 10,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Media",
        "notas": "Cosecha continua; evitar mojar hojas."
    },
    {
        "nombre": "Melón",
        "nombre_latin": "Cucumis melo",
        "variedad": "Piel de Sapo",
        "tipo": "Fruto",
        "temporada_optima": "Verano",
        "dias_crecimiento": 90,
        "litros_agua_semana": 8,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Trips"],
        "enfermedades": ["Oídio", "Fusarium"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 15,
        "temperatura_optima": 30,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Alta",
        "notas": "Reducir riego al final para mejorar dulzor."
    },
    {
        "nombre": "Sandía",
        "nombre_latin": "Citrullus lanatus",
        "variedad": "Crimson Sweet",
        "tipo": "Fruto",
        "temporada_optima": "Verano",
        "dias_crecimiento": 85,
        "litros_agua_semana": 10,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Trips"],
        "enfermedades": ["Oídio", "Fusarium"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 16,
        "temperatura_optima": 28,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Alta",
        "notas": "Necesita mucho sol y espacio."
    }
]

cultivos.extend(cultivos_fruto)

# ---------------------------------------------------------
# CULTIVOS DE HOJA — Datos reales
# ---------------------------------------------------------

cultivos_hoja = [
    {
        "nombre": "Lechuga",
        "nombre_latin": "Lactuca sativa",
        "variedad": "Romana",
        "tipo": "Hoja",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 60,
        "litros_agua_semana": 8,
        "fase_lunar": "Nueva",
        "plagas": ["Babosas", "Caracoles", "Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 5,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Cosecha escalonada; sensible al calor."
    },
    {
        "nombre": "Espinaca",
        "nombre_latin": "Spinacia oleracea",
        "variedad": "Gigante de Invierno",
        "tipo": "Hoja",
        "temporada_optima": "Otoño",
        "dias_crecimiento": 45,
        "litros_agua_semana": 6,
        "fase_lunar": "Nueva",
        "plagas": ["Minador", "Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 4,
        "temperatura_optima": 16,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Prefiere clima fresco; evitar calor extremo."
    },
    {
        "nombre": "Acelga",
        "nombre_latin": "Beta vulgaris var. cicla",
        "variedad": "Verde Penca Blanca",
        "tipo": "Hoja",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 55,
        "litros_agua_semana": 7,
        "fase_lunar": "Nueva",
        "plagas": ["Pulgón", "Mosca de la remolacha"],
        "enfermedades": ["Cercospora"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 5,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Alta",
        "notas": "Muy productiva; admite cortes sucesivos."
    },
    {
        "nombre": "Rúcula",
        "nombre_latin": "Eruca sativa",
        "variedad": "Selvatica",
        "tipo": "Hoja",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 40,
        "litros_agua_semana": 5,
        "fase_lunar": "Nueva",
        "plagas": ["Altica", "Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 6,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Media",
        "notas": "Sabor picante; crece muy rápido."
    },
    {
        "nombre": "Col rizada",
        "nombre_latin": "Brassica oleracea var. sabellica",
        "variedad": "Kale",
        "tipo": "Hoja",
        "temporada_optima": "Otoño",
        "dias_crecimiento": 70,
        "litros_agua_semana": 8,
        "fase_lunar": "Nueva",
        "plagas": ["Orugas", "Pulgón"],
        "enfermedades": ["Mildiu", "Alternaria"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": -5,
        "temperatura_optima": 15,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Alta",
        "notas": "Tolera heladas; mejora sabor con frío."
    },
    {
        "nombre": "Repollo",
        "nombre_latin": "Brassica oleracea var. capitata",
        "variedad": "Tardío",
        "tipo": "Hoja",
        "temporada_optima": "Otoño",
        "dias_crecimiento": 90,
        "litros_agua_semana": 10,
        "fase_lunar": "Nueva",
        "plagas": ["Orugas", "Mosca de la col"],
        "enfermedades": ["Mildiu", "Hernia de la col"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 0,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Alta",
        "notas": "Requiere suelos ricos y humedad constante."
    }
]

cultivos.extend(cultivos_hoja)

# ---------------------------------------------------------
# CULTIVOS DE RAÍZ — Datos reales
# ---------------------------------------------------------

cultivos_raiz = [
    {
        "nombre": "Zanahoria",
        "nombre_latin": "Daucus carota",
        "variedad": "Nantesa",
        "tipo": "Raíz",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 75,
        "litros_agua_semana": 6,
        "fase_lunar": "Menguante",
        "plagas": ["Mosca de la zanahoria", "Pulgón"],
        "enfermedades": ["Alternaria", "Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 4,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Prefiere suelos sueltos y profundos."
    },
    {
        "nombre": "Rábano",
        "nombre_latin": "Raphanus sativus",
        "variedad": "Cherry Belle",
        "tipo": "Raíz",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 30,
        "litros_agua_semana": 5,
        "fase_lunar": "Menguante",
        "plagas": ["Altica", "Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 5,
        "temperatura_optima": 16,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Crecimiento muy rápido; ideal para siembras sucesivas."
    },
    {
        "nombre": "Remolacha",
        "nombre_latin": "Beta vulgaris",
        "variedad": "Detroit",
        "tipo": "Raíz",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 60,
        "litros_agua_semana": 6,
        "fase_lunar": "Menguante",
        "plagas": ["Mosca de la remolacha"],
        "enfermedades": ["Cercospora"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 6,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Tolera frío; hojas también comestibles."
    },
    {
        "nombre": "Nabo",
        "nombre_latin": "Brassica rapa",
        "variedad": "Blanco Globo",
        "tipo": "Raíz",
        "temporada_optima": "Otoño",
        "dias_crecimiento": 55,
        "litros_agua_semana": 6,
        "fase_lunar": "Menguante",
        "plagas": ["Altica", "Orugas"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 4,
        "temperatura_optima": 15,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Prefiere clima fresco; rápido crecimiento."
    },
    {
        "nombre": "Chirivía",
        "nombre_latin": "Pastinaca sativa",
        "variedad": "Guernsey",
        "tipo": "Raíz",
        "temporada_optima": "Otoño",
        "dias_crecimiento": 120,
        "litros_agua_semana": 7,
        "fase_lunar": "Menguante",
        "plagas": ["Mosca de la zanahoria"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 2,
        "temperatura_optima": 14,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Mejora sabor tras primeras heladas."
    }
]

cultivos.extend(cultivos_raiz)

# ---------------------------------------------------------
# CULTIVOS LEGUMINOSOS — Datos reales
# ---------------------------------------------------------

cultivos_leguminosas = [
    {
        "nombre": "Judía verde",
        "nombre_latin": "Phaseolus vulgaris",
        "variedad": "Perona",
        "tipo": "Leguminosa",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 60,
        "litros_agua_semana": 8,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Araña roja", "Trips"],
        "enfermedades": ["Antracnosis", "Roya"],
        "plazo_seguridad": 3,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 10,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Fijadora de nitrógeno; ideal para rotaciones."
    },
    {
        "nombre": "Guisante",
        "nombre_latin": "Pisum sativum",
        "variedad": "Rondo",
        "tipo": "Leguminosa",
        "temporada_optima": "Invierno",
        "dias_crecimiento": 70,
        "litros_agua_semana": 6,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Trips"],
        "enfermedades": ["Mildiu", "Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 4,
        "temperatura_optima": 16,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Prefiere climas frescos; sensible al calor."
    },
    {
        "nombre": "Haba",
        "nombre_latin": "Vicia faba",
        "variedad": "Aguadulce",
        "tipo": "Leguminosa",
        "temporada_optima": "Invierno",
        "dias_crecimiento": 90,
        "litros_agua_semana": 7,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón negro"],
        "enfermedades": ["Roya"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 2,
        "temperatura_optima": 14,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy resistente al frío; fijadora de nitrógeno."
    },
    {
        "nombre": "Lenteja",
        "nombre_latin": "Lens culinaris",
        "variedad": "Pardina",
        "tipo": "Leguminosa",
        "temporada_optima": "Invierno",
        "dias_crecimiento": 100,
        "litros_agua_semana": 5,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 2,
        "temperatura_optima": 15,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy rústica; tolera sequía."
    },
    {
        "nombre": "Garbanzo",
        "nombre_latin": "Cicer arietinum",
        "variedad": "Pedrosillano",
        "tipo": "Leguminosa",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 110,
        "litros_agua_semana": 4,
        "fase_lunar": "Creciente",
        "plagas": ["Gorgojo", "Pulgón"],
        "enfermedades": ["Rabia del garbanzo"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 8,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy resistente; ideal para zonas secas."
    }
]

cultivos.extend(cultivos_leguminosas)

# ---------------------------------------------------------
# TUBÉRCULOS — Datos reales
# ---------------------------------------------------------

cultivos_tuberculos = [
    {
        "nombre": "Patata",
        "nombre_latin": "Solanum tuberosum",
        "variedad": "Kennebec",
        "tipo": "Tubérculo",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 110,
        "litros_agua_semana": 12,
        "fase_lunar": "Menguante",
        "plagas": ["Escarabajo de la patata", "Pulgón"],
        "enfermedades": ["Mildiu", "Rizoctonia"],
        "plazo_seguridad": 7,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 7,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Alta",
        "notas": "Evitar encharcamientos; rotar para evitar mildiu."
    },
    {
        "nombre": "Boniato",
        "nombre_latin": "Ipomoea batatas",
        "variedad": "Beauregard",
        "tipo": "Tubérculo",
        "temporada_optima": "Verano",
        "dias_crecimiento": 120,
        "litros_agua_semana": 10,
        "fase_lunar": "Menguante",
        "plagas": ["Gusanos del suelo"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 15,
        "temperatura_optima": 28,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Requiere calor constante; muy sensible al frío."
    },
    {
        "nombre": "Yuca",
        "nombre_latin": "Manihot esculenta",
        "variedad": "Valencia",
        "tipo": "Tubérculo",
        "temporada_optima": "Verano",
        "dias_crecimiento": 180,
        "litros_agua_semana": 8,
        "fase_lunar": "Menguante",
        "plagas": ["Cochinilla", "Ácaros"],
        "enfermedades": ["Bacteriosis"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 18,
        "temperatura_optima": 30,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Media",
        "notas": "Muy resistente a sequía; cultivo tropical."
    },
    {
        "nombre": "Jengibre",
        "nombre_latin": "Zingiber officinale",
        "variedad": None,
        "tipo": "Tubérculo",
        "temporada_optima": "Verano",
        "dias_crecimiento": 200,
        "litros_agua_semana": 10,
        "fase_lunar": "Menguante",
        "plagas": ["Nematodos"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 18,
        "temperatura_optima": 28,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Media",
        "notas": "Prefiere sombra parcial y suelos húmedos."
    },
    {
        "nombre": "Cúrcuma",
        "nombre_latin": "Curcuma longa",
        "variedad": None,
        "tipo": "Tubérculo",
        "temporada_optima": "Verano",
        "dias_crecimiento": 210,
        "litros_agua_semana": 10,
        "fase_lunar": "Menguante",
        "plagas": ["Nematodos"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 18,
        "temperatura_optima": 30,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Media",
        "notas": "Cultivo tropical; requiere humedad constante."
    }
]

cultivos.extend(cultivos_tuberculos)

# ---------------------------------------------------------
# AROMÁTICAS — Datos reales
# ---------------------------------------------------------

cultivos_aromaticas = [
    {
        "nombre": "Albahaca",
        "nombre_latin": "Ocimum basilicum",
        "variedad": "Genovesa",
        "tipo": "Aromática",
        "temporada_optima": "Verano",
        "dias_crecimiento": 50,
        "litros_agua_semana": 6,
        "fase_lunar": "Creciente",
        "plagas": ["Mosca blanca", "Pulgón"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 12,
        "temperatura_optima": 24,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Muy sensible al frío; favorece a tomates si se cultiva cerca."
    },
    {
        "nombre": "Perejil",
        "nombre_latin": "Petroselinum crispum",
        "variedad": "Rizado",
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 70,
        "litros_agua_semana": 5,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Septoriosis"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 4,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Germinación lenta; prefiere sombra parcial."
    },
    {
        "nombre": "Cilantro",
        "nombre_latin": "Coriandrum sativum",
        "variedad": None,
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 45,
        "litros_agua_semana": 6,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 6,
        "temperatura_optima": 20,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Tiende a espigarse con calor; ideal en primavera."
    },
    {
        "nombre": "Tomillo",
        "nombre_latin": "Thymus vulgaris",
        "variedad": None,
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 80,
        "litros_agua_semana": 3,
        "fase_lunar": "Creciente",
        "plagas": ["Cochinilla"],
        "enfermedades": ["Oídio"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 5,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy resistente; ideal para suelos pobres."
    },
    {
        "nombre": "Romero",
        "nombre_latin": "Rosmarinus officinalis",
        "variedad": None,
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 90,
        "litros_agua_semana": 2,
        "fase_lunar": "Creciente",
        "plagas": ["Cochinilla", "Mosca blanca"],
        "enfermedades": ["Oídio"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 0,
        "temperatura_optima": 20,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy rústico; soporta sequía y suelos pobres."
    },
    {
        "nombre": "Orégano",
        "nombre_latin": "Origanum vulgare",
        "variedad": None,
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 80,
        "litros_agua_semana": 3,
        "fase_lunar": "Creciente",
        "plagas": ["Cochinilla"],
        "enfermedades": ["Oídio"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": 5,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Aromática muy resistente; ideal para climas secos."
    },
    {
        "nombre": "Menta",
        "nombre_latin": "Mentha spicata",
        "variedad": None,
        "tipo": "Aromática",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 60,
        "litros_agua_semana": 8,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Araña roja"],
        "enfermedades": ["Roya"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 14,
        "temperatura_minima": 5,
        "temperatura_optima": 18,
        "exigencia_hidrica": "Alta",
        "exigencia_nutrientes": "Media",
        "notas": "Muy invasiva; mejor cultivar en maceta."
    }
]

cultivos.extend(cultivos_aromaticas)

# ---------------------------------------------------------
# FLORES COMESTIBLES — Datos reales
# ---------------------------------------------------------

cultivos_flores = [
    {
        "nombre": "Caléndula",
        "nombre_latin": "Calendula officinalis",
        "variedad": None,
        "tipo": "Flor",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 55,
        "litros_agua_semana": 5,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón", "Mosca blanca"],
        "enfermedades": ["Oídio"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 6,
        "temperatura_optima": 20,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy usada como planta trampa; atrae plagas lejos de hortalizas."
    },
    {
        "nombre": "Capuchina",
        "nombre_latin": "Tropaeolum majus",
        "variedad": None,
        "tipo": "Flor",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 50,
        "litros_agua_semana": 6,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 10,
        "temperatura_minima": 8,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Flores comestibles; excelente para control biológico."
    },
    {
        "nombre": "Borraja",
        "nombre_latin": "Borago officinalis",
        "variedad": None,
        "tipo": "Flor",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 60,
        "litros_agua_semana": 7,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 6,
        "temperatura_optima": 20,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Media",
        "notas": "Atrae polinizadores; flores azules comestibles."
    },
    {
        "nombre": "Lavanda",
        "nombre_latin": "Lavandula angustifolia",
        "variedad": None,
        "tipo": "Flor",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 120,
        "litros_agua_semana": 3,
        "fase_lunar": "Creciente",
        "plagas": ["Cochinilla"],
        "enfermedades": ["Fusarium"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 20,
        "temperatura_minima": -5,
        "temperatura_optima": 22,
        "exigencia_hidrica": "Baja",
        "exigencia_nutrientes": "Baja",
        "notas": "Muy resistente; excelente para atraer abejas."
    },
    {
        "nombre": "Manzanilla",
        "nombre_latin": "Matricaria chamomilla",
        "variedad": None,
        "tipo": "Flor",
        "temporada_optima": "Primavera",
        "dias_crecimiento": 65,
        "litros_agua_semana": 5,
        "fase_lunar": "Creciente",
        "plagas": ["Pulgón"],
        "enfermedades": ["Mildiu"],
        "plazo_seguridad": 0,
        "frecuencia_tratamiento": 12,
        "temperatura_minima": 6,
        "temperatura_optima": 20,
        "exigencia_hidrica": "Media",
        "exigencia_nutrientes": "Baja",
        "notas": "Propiedades medicinales; atrae polinizadores."
    }
]

cultivos.extend(cultivos_flores)

# ---------------------------------------------------------
# INSERCIÓN FINAL EN LA BASE DE DATOS
# ---------------------------------------------------------

for c in cultivos:
    cultivo = CultivoTipo(
        nombre=c["nombre"],
        nombre_latin=c["nombre_latin"],
        variedad=c["variedad"],
        tipo=c["tipo"],
        temporada_optima=c["temporada_optima"],
        dias_crecimiento=c["dias_crecimiento"],
        litros_agua_semana=c["litros_agua_semana"],
        fase_lunar=c["fase_lunar"],
        plagas=c["plagas"],
        enfermedades=c["enfermedades"],
        plazo_seguridad=c["plazo_seguridad"],
        frecuencia_tratamiento=c["frecuencia_tratamiento"],
        temperatura_minima=c["temperatura_minima"],
        temperatura_optima=c["temperatura_optima"],
        exigencia_hidrica=c["exigencia_hidrica"],
        exigencia_nutrientes=c["exigencia_nutrientes"],
        notas=c["notas"],
        user_id=2
    )
    db.add(cultivo)

db.commit()
db.close()

print(">>> Catálogo de cultivos REALISTA cargado correctamente.")
