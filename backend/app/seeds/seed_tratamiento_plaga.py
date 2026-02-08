# app/seeds/seed_tratamiento_plaga.py

from app.core.database import SessionLocal
from app.models.tratamiento_plaga import TratamientoPlaga
from app.models.plaga import Plaga
from app.models.tratamiento import Tratamiento

def run_all(user_id: int = 2):
    print(">>> Cargando relaciones Tratamiento ↔ Plaga...")

    db = SessionLocal()

    # ============================================================
    # MAPEO REALISTA DE PLAGAS → TRATAMIENTOS
    # Cada plaga tendrá 2 tratamientos compatibles
    # ============================================================

    relaciones = {

        # ------------------------------------------------------------
        # PLAGAS DE HORTÍCOLAS
        # ------------------------------------------------------------

        "Mosca blanca": ["Acetamiprid", "Piretrinas naturales"],
        "Pulgón verde": ["Flonicamid", "Jabón potásico"],
        "Pulgón negro": ["Piretrinas naturales", "Azadiractina"],
        "Trips": ["Spinosad", "Spinetoram"],
        "Tuta absoluta": ["Indoxacarb", "Chlorantraniliprole"],
        "Araña roja": ["Abamectina", "Fenpiroximato"],
        "Minador de hoja": ["Abamectina", "Metomilo"],
        "Mosca del mantillo": ["Beauveria bassiana", "Metarhizium anisopliae"],
        "Oruga del tomate": ["Spinosad", "Chlorantraniliprole"],
        "Gusano gris": ["Metaflumizone", "Indoxacarb"],
        "Caracoles": ["Jabón potásico", "Aceite de naranja"],
        "Babosas": ["Jabón potásico", "Extracto de ortiga"],
        "Mosca del apio": ["Piretrinas naturales", "Acetamiprid"],
        "Mosca del puerro": ["Spinosad", "Piretrinas naturales"],
        "Mosca de la zanahoria": ["Spinosad", "Azadiractina"],

        # ------------------------------------------------------------
        # PLAGAS DE FRUTALES
        # ------------------------------------------------------------

        "Carpocapsa": ["Chlorantraniliprole", "Deltametrina"],
        "Mosca de la fruta": ["Spinosad", "Deltametrina"],
        "Piojo de San José": ["Aceite de parafina", "Acetamiprid"],
        "Cochinilla algodonosa": ["Aceite de parafina", "Piretrinas naturales"],
        "Cochinilla roja": ["Aceite de parafina", "Acetamiprid"],
        "Mosca del olivo": ["Spinosad", "Lambda-cihalotrina"],
        "Prays del olivo": ["Lambda-cihalotrina", "Deltametrina"],
        "Barrenador del olivo": ["Deltametrina", "Cipermetrina"],
        "Mosca del cerezo": ["Spinosad", "Deltametrina"],
        "Pulgón ceniciento": ["Flonicamid", "Piretrinas naturales"],
        "Pulgón lanígero": ["Acetamiprid", "Piretrinas naturales"],
        "Trips del melocotonero": ["Spinetoram", "Spinosad"],
        "Oruga del manzano": ["Chlorantraniliprole", "Indoxacarb"],
        "Oruga del peral": ["Chlorantraniliprole", "Spinosad"],

        # ------------------------------------------------------------
        # PLAGAS DE VID
        # ------------------------------------------------------------

        "Polilla del racimo": ["Chlorantraniliprole", "Spinosad"],
        "Araña amarilla": ["Fenpiroximato", "Abamectina"],
        "Cochinilla de la vid": ["Aceite de parafina", "Acetamiprid"],
        "Mosquito verde": ["Piretrinas naturales", "Acetamiprid"],

        # ------------------------------------------------------------
        # PLAGAS DE SUELO
        # ------------------------------------------------------------

        "Nematodos agalladores": ["Fluopyram", "Paecilomyces lilacinus"],
        "Nematodos del tomate": ["Oxamilo", "Purpureocillium lilacinum"],
        "Gusano alambre": ["Metaflumizone", "Indoxacarb"],
        "Rosquilla negra": ["Metaflumizone", "Spinosad"],

        # ------------------------------------------------------------
        # PLAGAS DE HOJA Y TALLO
        # ------------------------------------------------------------

        "Altica": ["Piretrinas naturales", "Deltametrina"],
        "Escarabajo de la patata": ["Indoxacarb", "Deltametrina"],
        "Gorgojo": ["Deltametrina", "Cipermetrina"],
        "Chinche verde": ["Acetamiprid", "Piretrinas naturales"],
        "Chinche marrón": ["Acetamiprid", "Piretrinas naturales"],
        "Trips occidental": ["Spinetoram", "Spinosad"],

        # ------------------------------------------------------------
        # PLAGAS DE GRANADO, HIGUERA, NOGAL, PISTACHO
        # ------------------------------------------------------------

        "Mosca del granado": ["Spinosad", "Deltametrina"],
        "Barrenador del pistacho": ["Deltametrina", "Cipermetrina"],
        "Pulgón del pistacho": ["Flonicamid", "Piretrinas naturales"],
        "Mosca del higo": ["Spinosad", "Piretrinas naturales"],
        "Barrenador del nogal": ["Deltametrina", "Cipermetrina"],

        # ------------------------------------------------------------
        # PLAGAS GENERALES
        # ------------------------------------------------------------

        "Mosca del vinagre": ["Piretrinas naturales", "Spinosad"],
        "Mosca del compost": ["Beauveria bassiana", "Metarhizium anisopliae"],
        "Trips generalista": ["Spinetoram", "Spinosad"],
        "Pulgón generalista": ["Flonicamid", "Piretrinas naturales"],
        "Cochinilla generalista": ["Aceite de parafina", "Acetamiprid"],
        "Oruga generalista": ["Chlorantraniliprole", "Spinosad"],
        "Minador generalista": ["Abamectina", "Metomilo"],

        # ------------------------------------------------------------
        # PLAGAS DE AROMÁTICAS
        # ------------------------------------------------------------

        "Mosca del romero": ["Piretrinas naturales", "Azadiractina"],
        "Pulgón de la lavanda": ["Flonicamid", "Piretrinas naturales"],
        "Trips de la albahaca": ["Spinosad", "Spinetoram"],

        # ------------------------------------------------------------
        # PLAGAS DE CEBOLLA, AJO, PUERRO
        # ------------------------------------------------------------

        "Trips de la cebolla": ["Spinetoram", "Spinosad"],
        "Mosca de la cebolla": ["Spinosad", "Piretrinas naturales"],
        "Mosca del ajo": ["Spinosad", "Azadiractina"],
        "Mosca del puerro": ["Piretrinas naturales", "Spinosad"],

        # ------------------------------------------------------------
        # PLAGAS DE PATATA
        # ------------------------------------------------------------

        "Escarabajo de la patata": ["Indoxacarb", "Deltametrina"],
        "Polilla de la patata": ["Chlorantraniliprole", "Spinosad"],

        # ------------------------------------------------------------
        # PLAGAS DE CUCURBITÁCEAS
        # ------------------------------------------------------------

        "Mosca del pepino": ["Piretrinas naturales", "Acetamiprid"],
        "Trips del pepino": ["Spinetoram", "Spinosad"],
        "Pulgón del calabacín": ["Flonicamid", "Azadiractina"],

        # ------------------------------------------------------------
        # PLAGAS DE LEGUMINOSAS
        # ------------------------------------------------------------

        "Gorgojo del guisante": ["Deltametrina", "Cipermetrina"],
        "Pulgón del haba": ["Flonicamid", "Piretrinas naturales"],

        # ------------------------------------------------------------
        # PLAGAS DE CÍTRICOS
        # ------------------------------------------------------------

        "Mosca del cítrico": ["Spinosad", "Deltametrina"],
        "Cochinilla del limonero": ["Aceite de parafina", "Acetamiprid"],
        "Pulgón del naranjo": ["Flonicamid", "Piretrinas naturales"]
    }

    # ============================================================
    # INSERCIÓN SEGURA
    # ============================================================

    for plaga_nombre, tratamientos_lista in relaciones.items():

        plaga = db.query(Plaga).filter_by(nombre=plaga_nombre).first()
        if not plaga:
            print(f"⚠ Plaga no encontrada en BD: {plaga_nombre}")
            continue

        for tratamiento_nombre in tratamientos_lista:
            tratamiento = db.query(Tratamiento).filter_by(nombre=tratamiento_nombre).first()
            if not tratamiento:
                print(f"⚠ Tratamiento no encontrado en BD: {tratamiento_nombre}")
                continue

            existe = db.query(TratamientoPlaga).filter_by(
                plaga_id=plaga.id,
                tratamiento_id=tratamiento.id
            ).first()

            if not existe:
                db.add(TratamientoPlaga(
                    plaga_id=plaga.id,
                    tratamiento_id=tratamiento.id
                ))

    db.commit()
    db.close()

    print(">>> Seed tratamiento_plaga COMPLETADO.")
