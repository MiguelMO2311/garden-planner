# app/seeds/seed_tratamientos.py

from app.core.database import SessionLocal
from app.models.tratamiento import Tratamiento

def run_all(user_id: int = 2):
    print(">>> Cargando tratamientos reales homologados UE...")

    db = SessionLocal()

    tratamientos = [

        # ============================================================
        # FUNGICIDAS (20)
        # ============================================================

        {"nombre": "Cobre oxicloruro", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 20,
         "descripcion": "Fungicida preventivo contra mildiu, repilo y bacteriosis.",
         "productos": "Oxicloruro de cobre", "estaciones": ["otoño", "invierno", "primavera"]},

        {"nombre": "Cobre hidróxido", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 20,
         "descripcion": "Fungicida preventivo para frutales, olivo y hortícolas.",
         "productos": "Hidróxido de cobre", "estaciones": ["otoño", "primavera"]},

        {"nombre": "Azufre mojable", "tipo": "preventivo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Preventivo contra oídio en hortícolas, frutales y vid.",
         "productos": "Azufre 80%", "estaciones": ["primavera", "verano"]},

        {"nombre": "Azufre ventilado", "tipo": "preventivo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Control de oídio en vid y cucurbitáceas.",
         "productos": "Azufre micronizado", "estaciones": ["primavera", "verano"]},

        {"nombre": "Metalaxil-M", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Fungicida sistémico contra mildiu.",
         "productos": "Metalaxil-M", "estaciones": ["primavera"]},

        {"nombre": "Propamocarb", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de Phytophthora y Pythium.",
         "productos": "Propamocarb", "estaciones": ["primavera", "verano"]},

        {"nombre": "Fosetil-Al", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Fungicida sistémico contra mildiu y hongos de raíz.",
         "productos": "Fosetil-Al", "estaciones": ["primavera"]},

        {"nombre": "Mancozeb", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Preventivo contra mildiu y alternaria.",
         "productos": "Mancozeb", "estaciones": ["primavera"]},

        {"nombre": "Captan", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Fungicida para frutales de pepita.",
         "productos": "Captan", "estaciones": ["primavera"]},

        {"nombre": "Ciprodinil", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de botritis y monilia.",
         "productos": "Ciprodinil", "estaciones": ["primavera", "otoño"]},

        {"nombre": "Tebuconazol", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Fungicida sistémico contra monilia y chancros.",
         "productos": "Tebuconazol", "estaciones": ["primavera", "otoño"]},

        {"nombre": "Difenoconazol", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de moteado y oídio.",
         "productos": "Difenoconazol", "estaciones": ["primavera"]},

        {"nombre": "Penconazol", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Fungicida sistémico contra oídio.",
         "productos": "Penconazol", "estaciones": ["primavera", "verano"]},

        {"nombre": "Boscalida", "tipo": "curativo", "duracion_dias": 12, "frecuencia_dias": 18,
         "descripcion": "Control de botritis y alternaria.",
         "productos": "Boscalida", "estaciones": ["primavera"]},

        {"nombre": "Pyraclostrobin", "tipo": "preventivo", "duracion_dias": 12, "frecuencia_dias": 18,
         "descripcion": "Fungicida QoI para frutales y hortícolas.",
         "productos": "Pyraclostrobin", "estaciones": ["primavera"]},

        {"nombre": "Azoxistrobin", "tipo": "preventivo", "duracion_dias": 12, "frecuencia_dias": 18,
         "descripcion": "Control de mildiu, roya y alternaria.",
         "productos": "Azoxistrobin", "estaciones": ["primavera"]},

        {"nombre": "Fludioxonil", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de botritis.",
         "productos": "Fludioxonil", "estaciones": ["primavera"]},

        {"nombre": "Iprodiona", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de botritis y esclerotinia.",
         "productos": "Iprodiona", "estaciones": ["primavera"]},

        {"nombre": "Trifloxistrobin", "tipo": "preventivo", "duracion_dias": 12, "frecuencia_dias": 18,
         "descripcion": "Control de oídio y roya.",
         "productos": "Trifloxistrobin", "estaciones": ["primavera"]},

        {"nombre": "Folpet", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Fungicida de contacto para vid y frutales.",
         "productos": "Folpet", "estaciones": ["primavera"]},

        # ============================================================
        # INSECTICIDAS (15)
        # ============================================================

        {"nombre": "Spinosad", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control de orugas, trips y mosca del olivo.",
         "productos": "Spinosad", "estaciones": ["primavera", "verano"]},

        {"nombre": "Lambda-cihalotrina", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Insecticida de choque para orugas y escarabajos.",
         "productos": "Lambda-cihalotrina", "estaciones": ["primavera", "verano"]},

        {"nombre": "Deltametrina", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Insecticida de amplio espectro.",
         "productos": "Deltametrina", "estaciones": ["primavera", "verano"]},

        {"nombre": "Cipermetrina", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de orugas y coleópteros.",
         "productos": "Cipermetrina", "estaciones": ["primavera", "verano"]},

        {"nombre": "Imidacloprid", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Sistémico contra pulgón y mosca blanca.",
         "productos": "Imidacloprid", "estaciones": ["primavera"]},

        {"nombre": "Acetamiprid", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control de pulgón, mosca blanca y cochinilla.",
         "productos": "Acetamiprid", "estaciones": ["primavera"]},

        {"nombre": "Chlorantraniliprole", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de orugas perforadoras.",
         "productos": "Clorantraniliprol", "estaciones": ["primavera"]},

        {"nombre": "Indoxacarb", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de Tuta absoluta y orugas.",
         "productos": "Indoxacarb", "estaciones": ["primavera"]},

        {"nombre": "Flupyradifurone", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control de pulgón y mosca blanca.",
         "productos": "Flupyradifurone", "estaciones": ["primavera"]},

        {"nombre": "Piretrinas naturales", "tipo": "curativo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Insecticida natural de amplio espectro.",
         "productos": "Piretrinas", "estaciones": ["primavera", "verano"]},

        {"nombre": "Azadiractina", "tipo": "preventivo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Inhibidor de crecimiento para pulgón y mosca blanca.",
         "productos": "Azadiractina", "estaciones": ["primavera", "verano"]},

        {"nombre": "Spinetoram", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control de trips y orugas.",
         "productos": "Spinetoram", "estaciones": ["primavera"]},

        {"nombre": "Metaflumizone", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de orugas.",
         "productos": "Metaflumizone", "estaciones": ["primavera"]},

        {"nombre": "Buprofezin", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de mosca blanca.",
         "productos": "Buprofezin", "estaciones": ["primavera"]},

        {"nombre": "Flonicamid", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de pulgón.",
         "productos": "Flonicamid", "estaciones": ["primavera"]},

        # ============================================================
        # ACARICIDAS (5)
        # ============================================================

        {"nombre": "Abamectina", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control de araña roja y minadores.",
         "productos": "Abamectina", "estaciones": ["verano"]},

        {"nombre": "Fenpiroximato", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de ácaros tetraníquidos.",
         "productos": "Fenpiroximato", "estaciones": ["verano"]},

        {"nombre": "Spirodiclofen", "tipo": "curativo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de ácaros en frutales.",
         "productos": "Spirodiclofen", "estaciones": ["verano"]},

        {"nombre": "Clofentezina", "tipo": "preventivo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de huevos de ácaros.",
         "productos": "Clofentezina", "estaciones": ["primavera"]},

        {"nombre": "Hexythiazox", "tipo": "preventivo", "duracion_dias": 14, "frecuencia_dias": 20,
         "descripcion": "Control de huevos y larvas de ácaros.",
         "productos": "Hexythiazox", "estaciones": ["primavera"]},

        # ============================================================
        # NEMATICIDAS (3)
        # ============================================================

        {"nombre": "Fluopyram", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control de nematodos en hortícolas.",
         "productos": "Fluopyram", "estaciones": ["primavera"]},

        {"nombre": "Oxamilo", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control de nematodos agalladores.",
         "productos": "Oxamilo", "estaciones": ["primavera"]},

        {"nombre": "Fosthiazate", "tipo": "curativo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control de nematodos en suelo.",
         "productos": "Fosthiazate", "estaciones": ["primavera"]},

        # ============================================================
        # BACTERICIDAS (5)
        # ============================================================

        {"nombre": "Kasugamicina", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de bacteriosis en hortícolas.",
         "productos": "Kasugamicina", "estaciones": ["primavera"]},

        {"nombre": "Oxitetraciclina", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de bacteriosis en frutales.",
         "productos": "Oxitetraciclina", "estaciones": ["primavera"]},

        {"nombre": "Estreptomicina", "tipo": "curativo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control de bacteriosis en frutales.",
         "productos": "Estreptomicina", "estaciones": ["primavera"]},

        {"nombre": "Cobre bactericida", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 20,
         "descripcion": "Control preventivo de bacteriosis.",
         "productos": "Cobre", "estaciones": ["otoño", "primavera"]},

        {"nombre": "Extracto de ajo bactericida", "tipo": "preventivo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control ecológico de bacteriosis.",
         "productos": "Extracto de ajo", "estaciones": ["primavera"]},

        # ============================================================
        # BIOLÓGICOS (7)
        # ============================================================

        {"nombre": "Bacillus thuringiensis", "tipo": "preventivo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control biológico de orugas.",
         "productos": "Bt kurstaki", "estaciones": ["primavera", "verano"]},

        {"nombre": "Beauveria bassiana", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control biológico de insectos.",
         "productos": "Beauveria", "estaciones": ["primavera"]},

        {"nombre": "Metarhizium anisopliae", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control biológico de insectos del suelo.",
         "productos": "Metarhizium", "estaciones": ["primavera"]},

        {"nombre": "Trichoderma harzianum", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 60,
         "descripcion": "Protección de raíces contra hongos de suelo.",
         "productos": "Trichoderma harzianum", "estaciones": ["primavera", "otoño"]},

        {"nombre": "Trichoderma asperellum", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 60,
         "descripcion": "Control biológico de hongos de suelo.",
         "productos": "Trichoderma asperellum", "estaciones": ["primavera", "otoño"]},

        {"nombre": "Bacillus subtilis", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control biológico de hongos foliares.",
         "productos": "Bacillus subtilis", "estaciones": ["primavera"]},

        {"nombre": "Bacillus amyloliquefaciens", "tipo": "preventivo", "duracion_dias": 10, "frecuencia_dias": 14,
         "descripcion": "Control biológico de hongos y bacterias.",
         "productos": "Bacillus amyloliquefaciens", "estaciones": ["primavera"]},

        {"nombre": "Paecilomyces lilacinus", "tipo": "preventivo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control biológico de nematodos.",
         "productos": "Paecilomyces lilacinus", "estaciones": ["primavera"]},

        {"nombre": "Purpureocillium lilacinum", "tipo": "preventivo", "duracion_dias": 20, "frecuencia_dias": 30,
         "descripcion": "Control biológico de nematodos.",
         "productos": "Purpureocillium lilacinum", "estaciones": ["primavera"]},

        {"nombre": "Lecanicillium muscarium", "tipo": "curativo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Control biológico de mosca blanca y pulgón.",
         "productos": "Lecanicillium muscarium", "estaciones": ["primavera"]},

        # ============================================================
        # ECOLÓGICOS (6)
        # ============================================================

        {"nombre": "Jabón potásico", "tipo": "curativo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Control ecológico de pulgón, mosca blanca y cochinilla.",
         "productos": "Sales potásicas de ácidos grasos", "estaciones": ["primavera", "verano"]},

        {"nombre": "Extracto de ortiga", "tipo": "preventivo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Fortificante y repelente natural contra pulgón.",
         "productos": "Urtica dioica", "estaciones": ["primavera"]},

        {"nombre": "Extracto de cola de caballo", "tipo": "preventivo", "duracion_dias": 7, "frecuencia_dias": 10,
         "descripcion": "Fungicida ecológico contra mildiu y oídio.",
         "productos": "Equisetum arvense", "estaciones": ["primavera", "verano"]},

        {"nombre": "Aceite de naranja", "tipo": "curativo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Insecticida natural contra cochinilla y pulgón.",
         "productos": "d-Limoneno", "estaciones": ["primavera", "verano"]},

        {"nombre": "Bicarbonato potásico", "tipo": "curativo", "duracion_dias": 5, "frecuencia_dias": 7,
         "descripcion": "Fungicida ecológico contra oídio.",
         "productos": "Bicarbonato potásico", "estaciones": ["verano"]},

        {"nombre": "Aceite de parafina", "tipo": "preventivo", "duracion_dias": 14, "frecuencia_dias": 30,
         "descripcion": "Control de huevos invernantes y cochinillas.",
         "productos": "Aceite mineral", "estaciones": ["invierno"]},

        # ============================================================
        # TRAMPAS Y FEROMONAS (4)
        # ============================================================

        {"nombre": "Trampas cromáticas amarillas", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 30,
         "descripcion": "Captura de mosca blanca y pulgón alado.",
         "productos": "Placas adhesivas amarillas", "estaciones": ["primavera", "verano"]},

        {"nombre": "Trampas cromáticas azules", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 30,
         "descripcion": "Captura de trips.",
         "productos": "Placas adhesivas azules", "estaciones": ["primavera", "verano"]},

        {"nombre": "Feromonas para Tuta absoluta", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 30,
         "descripcion": "Captura masiva de machos de Tuta absoluta.",
         "productos": "Feromona Tuta", "estaciones": ["primavera", "verano"]},

        {"nombre": "Feromonas para Carpocapsa", "tipo": "preventivo", "duracion_dias": 30, "frecuencia_dias": 30,
         "descripcion": "Captura masiva de machos de Cydia pomonella.",
         "productos": "Feromona Carpocapsa", "estaciones": ["primavera", "verano"]}

    ]

    # ============================================================
    # INSERCIÓN SEGURA SIN DUPLICADOS
    # ============================================================

    existentes = {t.nombre for t in db.query(Tratamiento).all()}

    for t in tratamientos:
        if t["nombre"] not in existentes:
            db.add(Tratamiento(**t))

    db.commit()
    db.close()

    print(">>> Seed tratamientos (60) completado.")
