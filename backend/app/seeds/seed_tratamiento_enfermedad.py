# app/seeds/seed_tratamiento_enfermedad.py

from app.core.database import SessionLocal
from app.models.tratamiento_enfermedad import TratamientoEnfermedad
from app.models.enfermedad import Enfermedad
from app.models.tratamiento import Tratamiento

def run_all(user_id: int = 2):
    print(">>> Cargando relaciones Tratamiento ↔ Enfermedad...")

    db = SessionLocal()

    # ============================================================
    # MAPEO REALISTA DE ENFERMEDADES → TRATAMIENTOS
    # Cada enfermedad tendrá 2 tratamientos compatibles
    # ============================================================

    relaciones = {

        # ------------------------------------------------------------
        # HONGOS FOLIARES
        # ------------------------------------------------------------

        "Oídio": ["Azufre mojable", "Penconazol"],
        "Mildiu": ["Metalaxil-M", "Fosetil-Al"],
        "Botritis": ["Ciprodinil", "Fludioxonil"],
        "Alternaria": ["Boscalida", "Azoxistrobin"],
        "Roya": ["Trifloxistrobin", "Azoxistrobin"],
        "Antracnosis": ["Captan", "Tebuconazol"],
        "Monilia": ["Tebuconazol", "Ciprodinil"],
        "Abolladura del melocotonero": ["Cobre hidróxido", "Tebuconazol"],
        "Moteado": ["Difenoconazol", "Captan"],
        "Repilo del olivo": ["Cobre oxicloruro", "Cobre hidróxido"],
        "Ojo de gallo del olivo": ["Cobre hidróxido", "Cobre oxicloruro"],
        "Mildiu de la vid": ["Metalaxil-M", "Fosetil-Al"],
        "Oídio de la vid": ["Azufre ventilado", "Penconazol"],
        "Black rot de la vid": ["Azoxistrobin", "Captan"],
        "Yesca de la vid": ["Trichoderma harzianum", "Trichoderma asperellum"],
        "Eutipiosis": ["Trichoderma asperellum", "Pasta cicatrizante"],
        "Esca": ["Trichoderma harzianum", "Pasta cicatrizante"],

        # ------------------------------------------------------------
        # VIRUS
        # ------------------------------------------------------------

        "Virus del mosaico del pepino": ["Extracto de cola de caballo", "Extracto de ortiga"],
        "Virus del mosaico del tomate": ["Extracto de ortiga", "Silicio foliar"],
        "Virus TYLCV": ["Azadiractina", "Piretrinas naturales"],
        "Virus AMV": ["Extracto de cola de caballo", "Silicio foliar"],
        "Virus TSWV": ["Spinosad", "Spinetoram"],
        "Virus del mosaico del calabacín": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico del melón": ["Extracto de cola de caballo", "Silicio foliar"],
        "Virus del mosaico de la sandía": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico del tabaco": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico del apio": ["Extracto de cola de caballo", "Silicio foliar"],
        "Virus del mosaico del perejil": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico del haba": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico del guisante": ["Extracto de ortiga", "Silicio foliar"],
        "Virus del mosaico de la vid": ["Extracto de cola de caballo", "Silicio foliar"],
        "Virus del enrollado del tomate": ["Azadiractina", "Piretrinas naturales"],

        # ------------------------------------------------------------
        # BACTERIAS
        # ------------------------------------------------------------

        "Fuego bacteriano": ["Kasugamicina", "Oxitetraciclina"],
        "Bacteriosis del tomate": ["Kasugamicina", "Cobre bactericida"],
        "Chancro bacteriano del tomate": ["Kasugamicina", "Oxitetraciclina"],
        "Podredumbre blanda bacteriana": ["Cobre bactericida", "Extracto de ajo bactericida"],
        "Podredumbre ácida del tomate": ["Cobre bactericida", "Extracto de ajo bactericida"],
        "Podredumbre negra de la col": ["Cobre bactericida", "Kasugamicina"],
        "Chancro del peral": ["Cobre hidróxido", "Oxitetraciclina"],
        "Chancro del manzano": ["Cobre oxicloruro", "Oxitetraciclina"],
        "Chancro del almendro": ["Cobre hidróxido", "Tebuconazol"],
        "Chancro del olivo": ["Cobre oxicloruro", "Cobre hidróxido"],
        "Chancro del pistacho": ["Cobre hidróxido", "Tebuconazol"],
        "Chancro del ciruelo": ["Cobre oxicloruro", "Tebuconazol"],
        "Chancro del cerezo": ["Cobre hidróxido", "Oxitetraciclina"],

        # ------------------------------------------------------------
        # HONGOS DE SUELO
        # ------------------------------------------------------------

        "Fusarium": ["Trichoderma harzianum", "Trichoderma asperellum"],
        "Verticillium": ["Trichoderma asperellum", "Trichoderma harzianum"],
        "Rizoctonia": ["Trichoderma harzianum", "Propamocarb"],
        "Pythium": ["Propamocarb", "Trichoderma harzianum"],
        "Sclerotinia": ["Iprodiona", "Boscalida"],
        "Podredumbre blanca de la cebolla": ["Cobre oxicloruro", "Trichoderma harzianum"],
        "Podredumbre basal del puerro": ["Cobre oxicloruro", "Trichoderma asperellum"],
        "Podredumbre seca del ajo": ["Trichoderma harzianum", "Cobre oxicloruro"],
        "Podredumbre rosada del ajo": ["Trichoderma asperellum", "Cobre oxicloruro"],

        # ------------------------------------------------------------
        # PODREDUMBRES DE FRUTO
        # ------------------------------------------------------------

        "Podredumbre gris de la fresa": ["Ciprodinil", "Fludioxonil"],
        "Podredumbre parda del melocotonero": ["Tebuconazol", "Ciprodinil"],
        "Podredumbre amarga del manzano": ["Captan", "Tebuconazol"],
        "Podredumbre del pimiento": ["Iprodiona", "Boscalida"],
        "Podredumbre del calabacín": ["Azoxistrobin", "Boscalida"],
        "Podredumbre del pepino": ["Azoxistrobin", "Boscalida"],
        "Podredumbre del melón": ["Azoxistrobin", "Boscalida"],
        "Podredumbre del tomate por Rhizoctonia": ["Trichoderma harzianum", "Propamocarb"],
        "Podredumbre del tomate por Fusarium": ["Trichoderma asperellum", "Trichoderma harzianum"],
        "Podredumbre del tomate por Phytophthora": ["Propamocarb", "Fosetil-Al"],

        # ------------------------------------------------------------
        # FITOPLASMAS
        # ------------------------------------------------------------

        "Fitoplasma del peral": ["Cobre hidróxido", "Silicio foliar"],
        "Fitoplasma del melocotonero": ["Cobre oxicloruro", "Silicio foliar"],
        "Fitoplasma del almendro": ["Cobre hidróxido", "Silicio foliar"],
        "Fitoplasma de la vid": ["Cobre oxicloruro", "Silicio foliar"],
        "Fitoplasma del olivo": ["Cobre hidróxido", "Silicio foliar"],
        "Fitoplasma del ciruelo": ["Cobre oxicloruro", "Silicio foliar"],
        "Fitoplasma del manzano": ["Cobre hidróxido", "Silicio foliar"],
        "Fitoplasma del pistacho": ["Cobre oxicloruro", "Silicio foliar"],
        "Fitoplasma del higo": ["Cobre hidróxido", "Silicio foliar"],
        "Fitoplasma del granado": ["Cobre oxicloruro", "Silicio foliar"],

        # ------------------------------------------------------------
        # ENFERMEDADES DE CEBOLLA, AJO, PUERRO
        # ------------------------------------------------------------

        "Mildiu de la cebolla": ["Cobre hidróxido", "Azoxistrobin"],
        "Podredumbre negra de la cebolla": ["Cobre oxicloruro", "Extracto de ajo bactericida"],
        "Podredumbre blanca del puerro": ["Trichoderma harzianum", "Cobre oxicloruro"],

        # ------------------------------------------------------------
        # ENFERMEDADES DE CUCURBITÁCEAS
        # ------------------------------------------------------------

        "Oídio del calabacín": ["Azufre mojable", "Penconazol"],
        "Mildiu del pepino": ["Metalaxil-M", "Fosetil-Al"],

        # ------------------------------------------------------------
        # ENFERMEDADES DE ROSAL
        # ------------------------------------------------------------

        "Oídio del rosal": ["Azufre mojable", "Penconazol"],
        "Roya del rosal": ["Trifloxistrobin", "Azoxistrobin"],
        "Mancha negra del rosal": ["Captan", "Tebuconazol"]
    }

    # ============================================================
    # INSERCIÓN SEGURA
    # ============================================================

    for enfermedad_nombre, tratamientos_lista in relaciones.items():

        enfermedad = db.query(Enfermedad).filter_by(nombre=enfermedad_nombre).first()
        if not enfermedad:
            print(f"⚠ Enfermedad no encontrada en BD: {enfermedad_nombre}")
            continue

        for tratamiento_nombre in tratamientos_lista:
            tratamiento = db.query(Tratamiento).filter_by(nombre=tratamiento_nombre).first()
            if not tratamiento:
                print(f"⚠ Tratamiento no encontrado en BD: {tratamiento_nombre}")
                continue

            existe = db.query(TratamientoEnfermedad).filter_by(
                enfermedad_id=enfermedad.id,
                tratamiento_id=tratamiento.id
            ).first()

            if not existe:
                db.add(TratamientoEnfermedad(
                    enfermedad_id=enfermedad.id,
                    tratamiento_id=tratamiento.id
                ))

    db.commit()
    db.close()

    print(">>> Seed tratamiento_enfermedad COMPLETADO.")
