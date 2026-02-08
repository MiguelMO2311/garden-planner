# app/seeds/seed_enfermedades.py

from app.core.database import SessionLocal
from app.models.enfermedad import Enfermedad
from app.models.cultivo_tipo import CultivoTipo

def run_all(user_id: int = 2):
    print(">>> Cargando enfermedades de catálogo...")

    db = SessionLocal()

    # Obtener el cultivo tipo "General"
    general = db.query(CultivoTipo).filter_by(nombre="General").first()
    if not general:
        raise Exception("Debes crear un cultivo tipo 'General' en seed_cultivos.py")

    general_id = general.id

    enfermedades = [
        {"nombre": "Oídio", "descripcion": "Hongo que genera micelio blanco en hojas, tallos y frutos."},
        {"nombre": "Mildiu", "descripcion": "Hongo que provoca manchas amarillas y necrosis en hojas."},
        {"nombre": "Botritis", "descripcion": "Podredumbre gris que afecta frutos y tejidos tiernos."},
        {"nombre": "Alternaria", "descripcion": "Manchas concéntricas oscuras en hojas y frutos."},
        {"nombre": "Fusarium", "descripcion": "Hongo de suelo que causa marchitez vascular."},
        {"nombre": "Verticillium", "descripcion": "Hongo de suelo que provoca marchitez y muerte regresiva."},
        {"nombre": "Roya", "descripcion": "Pústulas anaranjadas en el envés de las hojas."},
        {"nombre": "Antracnosis", "descripcion": "Lesiones hundidas en frutos y tallos."},
        {"nombre": "Monilia", "descripcion": "Podredumbre en frutales de hueso y pepita."},
        {"nombre": "Abolladura del melocotonero", "descripcion": "Deformación de hojas causada por Taphrina deformans."},
        {"nombre": "Moteado", "descripcion": "Manchas oscuras en manzano y peral causadas por Venturia spp."},
        {"nombre": "Fuego bacteriano", "descripcion": "Brotes ennegrecidos como quemados por Erwinia amylovora."},
        {"nombre": "Bacteriosis del tomate", "descripcion": "Manchas foliares y necrosis por Xanthomonas spp."},
        {"nombre": "Tizón tardío", "descripcion": "Podredumbre agresiva en tomate y patata por Phytophthora infestans."},
        {"nombre": "Tizón temprano", "descripcion": "Manchas concéntricas en hojas por Alternaria alternata."},
        {"nombre": "Rizoctonia", "descripcion": "Podredumbre de cuello en hortícolas."},
        {"nombre": "Pythium", "descripcion": "Damping-off en plántulas por hongos de suelo."},
        {"nombre": "Sclerotinia", "descripcion": "Podredumbre algodonosa en tallos y frutos."},
        {"nombre": "Ojo de gallo del olivo", "descripcion": "Manchas circulares en hojas del olivo."},
        {"nombre": "Repilo del olivo", "descripcion": "Defoliación severa causada por Spilocaea oleagina."},
        {"nombre": "Tinta del castaño", "descripcion": "Muerte de raíces por Phytophthora cinnamomi."},
        {"nombre": "Chancro del castaño", "descripcion": "Cancros en tronco por Cryphonectria parasitica."},
        {"nombre": "Mildiu de la vid", "descripcion": "Manchas aceitosas en hojas y racimos."},
        {"nombre": "Oídio de la vid", "descripcion": "Micelio blanco en racimos y hojas."},
        {"nombre": "Black rot de la vid", "descripcion": "Manchas negras en racimos por Guignardia bidwellii."},
        {"nombre": "Yesca de la vid", "descripcion": "Muerte regresiva por hongos de madera."},
        {"nombre": "Eutipiosis", "descripcion": "Cancros en madera de vid por Eutypa lata."},
        {"nombre": "Esca", "descripcion": "Decaimiento de madera en vid."},
        {"nombre": "Virus del mosaico del pepino", "descripcion": "Mosaicos y deformaciones en cucurbitáceas."},
        {"nombre": "Virus del mosaico del tomate", "descripcion": "Moteado y reducción de vigor."},
        {"nombre": "Virus TYLCV", "descripcion": "Rizado amarillo del tomate transmitido por mosca blanca."},
        {"nombre": "Virus AMV", "descripcion": "Mosaicos en hortícolas por Alfalfa Mosaic Virus."},
        {"nombre": "Podredumbre parda del melocotonero", "descripcion": "Podredumbre en frutos maduros por Monilinia fructicola."},
        {"nombre": "Podredumbre amarga del manzano", "descripcion": "Lesiones hundidas en frutos por Colletotrichum spp."},
        {"nombre": "Podredumbre blanca de la cebolla", "descripcion": "Hongo de suelo que destruye raíces de Allium spp."},
        {"nombre": "Mildiu de la cebolla", "descripcion": "Manchas violáceas en hojas por Peronospora destructor."},
        {"nombre": "Oídio del calabacín", "descripcion": "Micelio blanco en hojas de cucurbitáceas."},
        {"nombre": "Virus TSWV", "descripcion": "Bronceado y necrosis en tomate por trips."},
        {"nombre": "Podredumbre negra de la col", "descripcion": "Amarilleo y necrosis bacteriana por Xanthomonas campestris."},
        {"nombre": "Mildiu del pepino", "descripcion": "Manchas angulares en hojas por Pseudoperonospora cubensis."},
        {"nombre": "Podredumbre gris de la fresa", "descripcion": "Botritis en frutos de fresa."},
        {"nombre": "Oídio del rosal", "descripcion": "Micelio blanco en hojas y brotes de rosal."},
        {"nombre": "Roya del rosal", "descripcion": "Pústulas naranjas en hojas de rosal."},
        {"nombre": "Mancha negra del rosal", "descripcion": "Defoliación severa por Diplocarpon rosae."},
        {"nombre": "Chancro bacteriano del tomate", "descripcion": "Muy destructivo en solanáceas por Clavibacter michiganensis."},
        {"nombre": "Virus del enrollado de la vid", "descripcion": "Enrojecimiento y enrollado de hojas por GLRaV."},
        {"nombre": "Podredumbre del cuello del olivo", "descripcion": "Muerte regresiva por Phytophthora spp."},
        {"nombre": "Mildiu del apio", "descripcion": "Manchas foliares por Septoria apiicola."},
        {"nombre": "Antracnosis del pimiento", "descripcion": "Lesiones hundidas en frutos por Colletotrichum spp."},
        {"nombre": "Podredumbre por Armillaria", "descripcion": "Hongo de suelo que mata árboles viejos."},
        {"nombre": "Bacteriosis del pimiento", "descripcion": "Manchas foliares y necrosis por Xanthomonas vesicatoria."},
        {"nombre": "Virus del mosaico de la sandía", "descripcion": "Mosaicos y deformaciones en cucurbitáceas."},
        {"nombre": "Virus del mosaico del calabacín", "descripcion": "Moteado y deformación de hojas."},
        {"nombre": "Virus del mosaico del melón", "descripcion": "Clorosis y mosaicos en melón."},
        {"nombre": "Virus del mosaico de la lechuga", "descripcion": "Moteado y reducción de crecimiento."},
        {"nombre": "Virus del bronceado del tomate", "descripcion": "Manchas anulares y necrosis."},
        {"nombre": "Virus del mosaico del tabaco", "descripcion": "Moteado severo en solanáceas."},
        {"nombre": "Virus del mosaico del pepino tipo 2", "descripcion": "Clorosis y mosaicos en cucurbitáceas."},
        {"nombre": "Virus del mosaico de la alfalfa", "descripcion": "Mosaicos en hortícolas y leguminosas."},
        {"nombre": "Virus del mosaico del apio", "descripcion": "Clorosis y mosaicos en umbelíferas."},
        {"nombre": "Virus del mosaico del perejil", "descripcion": "Moteado y deformación foliar."},
        {"nombre": "Virus del mosaico del pimiento", "descripcion": "Clorosis y mosaicos en Capsicum spp."},
        {"nombre": "Virus del mosaico del pepino amarillo", "descripcion": "Clorosis intensa en cucurbitáceas."},
        {"nombre": "Virus del mosaico del tomate tipo 2", "descripcion": "Moteado severo y reducción de vigor."},
        {"nombre": "Virus del mosaico de la vid", "descripcion": "Clorosis y mosaicos en hojas de vid."},
        {"nombre": "Virus del enrollado del tomate", "descripcion": "Enanismo y clorosis."},
        {"nombre": "Virus del mosaico del haba", "descripcion": "Mosaicos y deformaciones en leguminosas."},
        {"nombre": "Virus del mosaico del guisante", "descripcion": "Clorosis y mosaicos en Pisum sativum."},
        {"nombre": "Virus del mosaico del pepino verde", "descripcion": "Moteado verde oscuro en hojas."},
        {"nombre": "Virus del mosaico del calabacín tipo 2", "descripcion": "Clorosis y mosaicos severos."},
        {"nombre": "Podredumbre blanda bacteriana", "descripcion": "Descomposición acuosa por Erwinia spp."},
        {"nombre": "Podredumbre ácida del tomate", "descripcion": "Descomposición por bacterias acidógenas."},
        {"nombre": "Podredumbre negra del tomate", "descripcion": "Lesiones negras en frutos por Alternaria."},
        {"nombre": "Podredumbre seca del ajo", "descripcion": "Hongo de suelo que seca bulbos."},
        {"nombre": "Podredumbre rosada del ajo", "descripcion": "Coloración rosada en raíces por Fusarium."},
        {"nombre": "Podredumbre basal del puerro", "descripcion": "Hongo que destruye la base del tallo."},
        {"nombre": "Podredumbre del cuello de la cebolla", "descripcion": "Hongo que afecta el cuello tras cosecha."},
        {"nombre": "Podredumbre negra de la cebolla", "descripcion": "Aspergillus niger en bulbos."},
        {"nombre": "Podredumbre blanca del puerro", "descripcion": "Hongo de suelo que destruye raíces."},
        {"nombre": "Podredumbre del pimiento", "descripcion": "Lesiones hundidas por Phytophthora capsici."},
        {"nombre": "Podredumbre del calabacín", "descripcion": "Hongo que afecta frutos en contacto con el suelo."},
        {"nombre": "Podredumbre del pepino", "descripcion": "Hongo que afecta frutos jóvenes."},
        {"nombre": "Podredumbre del melón", "descripcion": "Hongo que afecta frutos maduros."},
        {"nombre": "Podredumbre del tomate por Rhizoctonia", "descripcion": "Lesiones en cuello y raíces."},
        {"nombre": "Podredumbre del tomate por Fusarium", "descripcion": "Marchitez y necrosis vascular."},
        {"nombre": "Podredumbre del tomate por Phytophthora", "descripcion": "Lesiones acuosas en frutos."},
        {"nombre": "Chancro del manzano", "descripcion": "Lesiones hundidas en ramas por Nectria galligena."},
        {"nombre": "Chancro del peral", "descripcion": "Lesiones en ramas por Pseudomonas syringae."},
        {"nombre": "Chancro del almendro", "descripcion": "Lesiones en madera por hongos de madera."},
        {"nombre": "Chancro del olivo", "descripcion": "Lesiones en ramas por Pseudomonas savastanoi."},
        {"nombre": "Chancro del nogal", "descripcion": "Lesiones en corteza por hongos de madera."},
        {"nombre": "Chancro del pistacho", "descripcion": "Lesiones en ramas por Botryosphaeria spp."},
        {"nombre": "Chancro del ciruelo", "descripcion": "Lesiones en madera por Cytospora spp."},
        {"nombre": "Chancro del melocotonero", "descripcion": "Lesiones en ramas por Leucostoma spp."},
        {"nombre": "Chancro del cerezo", "descripcion": "Lesiones en ramas por Pseudomonas syringae."},
        {"nombre": "Chancro bacteriano del olivo", "descripcion": "Tumores y lesiones por Pseudomonas savastanoi."},
        {"nombre": "Fitoplasma del peral", "descripcion": "Decaimiento y amarilleo por fitoplasmas."},
        {"nombre": "Fitoplasma del melocotonero", "descripcion": "Enanismo y clorosis por fitoplasmas."},
        {"nombre": "Fitoplasma del almendro", "descripcion": "Decaimiento y muerte regresiva."},
        {"nombre": "Fitoplasma de la vid", "descripcion": "Decaimiento y enrollado de hojas."},
        {"nombre": "Fitoplasma del olivo", "descripcion": "Decaimiento general y amarilleo."},
        {"nombre": "Fitoplasma del ciruelo", "descripcion": "Enanismo y deformación de hojas."},
        {"nombre": "Fitoplasma del manzano", "descripcion": "Decaimiento y clorosis."},
        {"nombre": "Fitoplasma del pistacho", "descripcion": "Decaimiento y muerte regresiva."},
        {"nombre": "Fitoplasma del higo", "descripcion": "Clorosis y deformación foliar."},
        {"nombre": "Fitoplasma del granado", "descripcion": "Decaimiento y amarilleo."}
    ]
    
    existentes = {e.nombre for e in db.query(Enfermedad).all()}

    for e in enfermedades:
        if e["nombre"] not in existentes:
            db.add(Enfermedad(
                nombre=e["nombre"],
                descripcion=e["descripcion"],
                cultivo_tipo_id=general_id,   # ← AQUÍ EL CAMBIO IMPORTANTE
                cultivo_parcela_id=None       # ← NO SE USA EN CATÁLOGO
            ))

    db.commit()
    db.close()

    print(">>> Seed enfermedades completado.")
