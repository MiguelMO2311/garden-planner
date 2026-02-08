# app/seeds/seed_plagas.py

from app.core.database import SessionLocal
from app.models.plaga import Plaga

def run_all(user_id: int = 2):
    print(">>> Cargando 100 plagas reales...")

    db = SessionLocal()

    plagas = [
        {"nombre": "Pulgón verde del melocotonero", "descripcion": "Chupador polífago que se alimenta de savia en brotes tiernos y transmite virus."},
        {"nombre": "Pulgón negro de las habas", "descripcion": "Se alimenta de savia en brotes jóvenes y hojas, generando melaza abundante."},
        {"nombre": "Mosca blanca", "descripcion": "Chupador que se alimenta de savia en el envés de hojas, provocando negrilla."},
        {"nombre": "Araña roja", "descripcion": "Ácaro que perfora células foliares causando punteado clorótico y caída de hojas."},
        {"nombre": "Trips", "descripcion": "Raspador que se alimenta de células epidérmicas en hojas y flores, deformándolas."},
        {"nombre": "Cochinilla algodonosa", "descripcion": "Chupador que se alimenta de savia en tallos y hojas, produciendo melaza."},
        {"nombre": "Cochinilla de la tizne", "descripcion": "Se alimenta de savia en ramas y hojas, favoreciendo la negrilla."},
        {"nombre": "Mosca de la fruta", "descripcion": "Larvas que se alimentan de pulpa de frutos maduros causando pudriciones."},
        {"nombre": "Tuta absoluta", "descripcion": "Larvas minadoras que consumen mesófilo foliar, tallos y frutos de tomate."},
        {"nombre": "Minador de hojas", "descripcion": "Larvas que excavan galerías en hojas de hortícolas alimentándose del mesófilo."},
        {"nombre": "Orugas defoliadoras", "descripcion": "Larvas que consumen hojas de hortícolas y frutales."},
        {"nombre": "Rosquilla negra", "descripcion": "Larvas que cortan plántulas al nivel del suelo alimentándose del tallo."},
        {"nombre": "Gusano de alambre", "descripcion": "Larvas que perforan raíces y tubérculos alimentándose de tejidos internos."},
        {"nombre": "Escarabajo de la patata", "descripcion": "Adultos y larvas que devoran hojas de solanáceas."},
        {"nombre": "Altica", "descripcion": "Escarabajo saltador que perfora hojas jóvenes de brassicas."},
        {"nombre": "Mosca de la cebolla", "descripcion": "Larvas que se alimentan de bulbos y raíces de Allium spp."},
        {"nombre": "Mosca de la zanahoria", "descripcion": "Larvas que excavan raíces alimentándose de su tejido interno."},
        {"nombre": "Nematodos agalladores", "descripcion": "Gusanos que se alimentan de raíces provocando agallas y pérdida de vigor."},
        {"nombre": "Barrenador del almendro", "descripcion": "Larvas que perforan raíces y cuello alimentándose de madera viva."},
        {"nombre": "Carpocapsa", "descripcion": "Larvas que perforan frutos de pepita alimentándose de la pulpa."},
        {"nombre": "Mosca del olivo", "descripcion": "Larvas que se alimentan de la pulpa de aceitunas."},
        {"nombre": "Prays del olivo", "descripcion": "Larvas que consumen flores, frutos y hojas del olivo."},
        {"nombre": "Psylla del peral", "descripcion": "Chupador que se alimenta de savia en brotes y hojas."},
        {"nombre": "Ácaro rojo europeo", "descripcion": "Ácaro que se alimenta de células foliares causando clorosis."},
        {"nombre": "Polilla del racimo", "descripcion": "Larvas que consumen bayas de uva."},
        {"nombre": "Cochinilla del carmín", "descripcion": "Chupador que se alimenta de savia en cactus y ornamentales."},
        {"nombre": "Mosquito verde de la vid", "descripcion": "Chupador que se alimenta de savia en hojas de vid."},
        {"nombre": "Piojo de San José", "descripcion": "Cochinilla que se alimenta de savia en ramas y frutos."},
        {"nombre": "Gorgojo del avellano", "descripcion": "Larvas que consumen la semilla dentro de la avellana."},
        {"nombre": "Avispilla del castaño", "descripcion": "Larvas que se alimentan de tejidos internos formando agallas."},
        {"nombre": "Galeruca del olmo", "descripcion": "Larvas y adultos que devoran hojas de olmo."},
        {"nombre": "Procesionaria del pino", "descripcion": "Larvas que consumen acículas de pino."},
        {"nombre": "Barrenador del chopo", "descripcion": "Larvas que perforan troncos alimentándose de madera."},
        {"nombre": "Mosca del nogal", "descripcion": "Larvas que consumen el mesocarpio de la nuez."},
        {"nombre": "Pulgón lanígero del manzano", "descripcion": "Chupador que se alimenta de savia en raíces y ramas."},
        {"nombre": "Trips del gladiolo", "descripcion": "Raspador que se alimenta de pétalos y hojas."},
        {"nombre": "Gusano gris", "descripcion": "Larvas que cortan plántulas alimentándose del tallo."},
        {"nombre": "Polilla del repollo", "descripcion": "Larvas que devoran hojas de brassicas."},
        {"nombre": "Mosca minadora del puerro", "descripcion": "Larvas que excavan galerías en hojas de Allium spp."},
        {"nombre": "Ácaro del bronceado del tomate", "descripcion": "Se alimenta de epidermis foliar causando bronceado."},
        {"nombre": "Pulgón del rosal", "descripcion": "Chupador que se alimenta de savia en brotes tiernos."},
        {"nombre": "Trips del rosal", "descripcion": "Raspador que se alimenta de pétalos y brotes."},
        {"nombre": "Gusano cabezudo", "descripcion": "Larvas que perforan raíces de frutales de hueso."},
        {"nombre": "Barrenador del peral", "descripcion": "Larvas que perforan ramas alimentándose de madera."},
        {"nombre": "Mosca del apio", "descripcion": "Larvas que consumen tejido foliar en umbelíferas."},
        {"nombre": "Pulgón ceniciento del manzano", "descripcion": "Chupador que se alimenta de savia en brotes y frutos jóvenes."},
        {"nombre": "Gorgojo de la vid", "descripcion": "Adultos que devoran hojas y larvas que dañan raíces."},
        {"nombre": "Mosca del vinagre", "descripcion": "Larvas que se alimentan de pulpa de frutos blandos."},
        {"nombre": "Ácaro del olivo", "descripcion": "Se alimenta de hojas jóvenes causando deformaciones."},
        {"nombre": "Pulgón del almendro", "descripcion": "Chupador que se alimenta de savia en hojas y brotes."},
        {"nombre": "Caracol común", "descripcion": "Molusco que devora hojas tiernas, brotes y frutos en contacto con el suelo."},
        {"nombre": "Babosa gris", "descripcion": "Molusco que se alimenta de hojas, tallos y frutos jóvenes."},
        {"nombre": "Babosa negra", "descripcion": "Molusco que consume hojas y tallos de hortícolas."},
        {"nombre": "Saltamontes migratorio", "descripcion": "Ortóptero que devora hojas y tallos de múltiples cultivos."},
        {"nombre": "Langosta italiana", "descripcion": "Ortóptero que consume hojas y brotes de cultivos extensivos y huertos."},
        {"nombre": "Grillo topo", "descripcion": "Se alimenta de raíces y tallos subterráneos causando marchitez."},
        {"nombre": "Grillo común", "descripcion": "Devora hojas tiernas y brotes jóvenes."},
        {"nombre": "Escarabajo del pepino", "descripcion": "Adultos y larvas que devoran hojas y raíces de cucurbitáceas."},
        {"nombre": "Escarabajo del maíz", "descripcion": "Larvas que se alimentan de raíces y adultos de hojas."},
        {"nombre": "Barrenador del pistacho", "descripcion": "Larvas que consumen semillas dentro del fruto."},
        {"nombre": "Chinche del pistacho", "descripcion": "Se alimenta de semillas perforando frutos verdes."},
        {"nombre": "Pulgón del pistacho", "descripcion": "Chupador que se alimenta de savia en hojas y brotes."},
        {"nombre": "Polilla del almendro", "descripcion": "Larvas que consumen brotes tiernos y frutos."},
        {"nombre": "Minador del pistacho", "descripcion": "Larvas que excavan galerías en hojas jóvenes."},
        {"nombre": "Pulgón del nogal", "descripcion": "Chupador que se alimenta de savia en hojas."},
        {"nombre": "Mosca del higo", "descripcion": "Larvas que consumen pulpa de higos."},
        {"nombre": "Pulgón del romero", "descripcion": "Chupador que se alimenta de savia en brotes tiernos."},
        {"nombre": "Pulgón del tomillo", "descripcion": "Chupador que se alimenta de hojas jóvenes."},
        {"nombre": "Minador del olivo", "descripcion": "Larvas que excavan galerías en hojas jóvenes."},
        {"nombre": "Mosca del granado", "descripcion": "Larvas que consumen semillas dentro del fruto."},
        {"nombre": "Pulgón de la higuera", "descripcion": "Chupador que se alimenta de savia en hojas."},
        {"nombre": "Chinche verde", "descripcion": "Se alimenta de savia y frutos tiernos perforándolos."},
        {"nombre": "Topillo campesino", "descripcion": "Roedor que se alimenta de raíces, bulbos y tallos subterráneos."},
        {"nombre": "Ratón de campo", "descripcion": "Roedor que consume semillas, raíces y frutos caídos."},
        {"nombre": "Rata negra", "descripcion": "Roedor que se alimenta de frutos, semillas y corteza."},
        {"nombre": "Estornino negro", "descripcion": "Ave que consume frutos maduros y brotes tiernos."},
        {"nombre": "Gorrión común", "descripcion": "Ave que se alimenta de semillas, brotes y frutos pequeños."},
        {"nombre": "Mirlo", "descripcion": "Ave que consume frutos maduros y perfora bayas."},
        {"nombre": "Paloma torcaz", "descripcion": "Ave que devora brotes tiernos y hojas jóvenes."},
        {"nombre": "Avispa asiática", "descripcion": "Depredadora que daña frutos maduros y colmenas."},
        {"nombre": "Abeja carpintera", "descripcion": "Perfora madera estructural de árboles y postes."},
        {"nombre": "Avispa del almendro", "descripcion": "Larvas que consumen semillas dentro de la almendra."},
        {"nombre": "Avispa del castaño", "descripcion": "Larvas que se alimentan de tejidos internos formando agallas."},
        {"nombre": "Polilla del brote de vid", "descripcion": "Larvas que consumen brotes tiernos de vid."},
        {"nombre": "Cicadélidos de la vid", "descripcion": "Chupadores que se alimentan de savia en hojas."},
        {"nombre": "Filoxera (forma foliar)", "descripcion": "Chupador que se alimenta de savia en hojas y raíces."},
        {"nombre": "Minador de la vid", "descripcion": "Larvas que excavan galerías en hojas."},
        {"nombre": "Chinche de la vid", "descripcion": "Chupador que se alimenta de savia en hojas."},
        {"nombre": "Polilla del tomate perforadora", "descripcion": "Larvas que consumen pulpa de frutos verdes."},
        {"nombre": "Mosca del pepino", "descripcion": "Larvas que consumen pulpa de frutos jóvenes."},
        {"nombre": "Pulgón de la lechuga", "descripcion": "Chupador que se alimenta del corazón de la lechuga."},
        {"nombre": "Trips del puerro", "descripcion": "Raspador que se alimenta de epidermis foliar."},
        {"nombre": "Mosca del repollo", "descripcion": "Larvas que consumen raíces de brassicas."},
        {"nombre": "Pulgón de la espinaca", "descripcion": "Chupador que se alimenta de hojas jóvenes."},
        {"nombre": "Mosca del membrillero", "descripcion": "Larvas que consumen pulpa de membrillos."},
        {"nombre": "Minador del manzano", "descripcion": "Larvas que excavan galerías en hojas."},
        {"nombre": "Polilla oriental del melocotonero", "descripcion": "Larvas que consumen brotes y frutos."},
        {"nombre": "Pulgón del ciruelo", "descripcion": "Chupador que se alimenta de savia en hojas y brotes."},
        {"nombre": "Mosca del cerezo", "descripcion": "Larvas que consumen pulpa de cerezas."},
        {"nombre": "Carpocapsa del ciruelo", "descripcion": "Larvas que consumen pulpa de ciruelas."}
    ]

    existentes = {p.nombre for p in db.query(Plaga).all()}

    for p in plagas:
        if p["nombre"] not in existentes:
            db.add(Plaga(
                nombre=p["nombre"],
                descripcion=p["descripcion"],
                cultivo_parcela_id=None
            ))

    db.commit()
    db.close()

    print(">>> Seed plagas (100) completado.")
