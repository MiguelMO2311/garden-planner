# scripts/run_all_seeds.py

import sys
from pathlib import Path
import importlib
import pkgutil

# Añadir backend/ al PYTHONPATH
BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BASE_DIR))

SEEDS_PACKAGE = "app.seeds"

def main():
    print(">>> Buscando seeds en app/seeds/...")

    seeds_path = BASE_DIR / "app" / "seeds"

    for module_info in pkgutil.iter_modules([str(seeds_path)]):
        module_name = module_info.name
        full_module = f"{SEEDS_PACKAGE}.{module_name}"

        print(f">>> Cargando módulo: {full_module}")
        module = importlib.import_module(full_module)

        if hasattr(module, "run_all"):
            print(f" ---> Ejecutando {full_module}.run_all()")
            try:
                module.run_all(user_id=1)
            except TypeError:
                module.run_all()
        else:
            print(f" [!] El módulo {full_module} no tiene run_all(), se omite.")

    print("\n>>> TODOS LOS SEEDS EJECUTADOS CORRECTAMENTE.")

if __name__ == "__main__":
    main()
