# app/seeds/run_all_seeds.py

from app.seeds.seed_tomates import run as run_tomates
from app.seeds.seed_lechugas_grelos import run as run_lechugas
from app.seeds.seed_frutales import run as run_frutales
from app.seeds.seed_frutos_secos_y_arboles import run as run_frutos_secos
from app.seeds.seed_variedades_espanolas import run as run_variedades

def run_all(user_id: int = 2):
    print(">>> Ejecutando todos los seeds...")

    run_tomates(user_id)
    run_lechugas(user_id)
    run_frutales(user_id)
    run_frutos_secos(user_id)
    run_variedades(user_id)


    print(">>> Todos los seeds ejecutados correctamente.")

if __name__ == "__main__":
    run_all()
