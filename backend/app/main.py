from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User

# IMPORTA TODOS LOS MODELOS ANTES DE create_all
from app.models import tarea
from app.models import plot
from app.models.climate_event import ClimateEvent

# Crear tablas
Base.metadata.create_all(bind=engine)

# Crear usuario admin
def create_admin_user():
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin:
        new_admin = User(
            email="admin@example.com",
            hashed_password=hash_password("12345"),
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print(">>> Usuario admin creado correctamente")
    else:
        print(">>> Usuario admin ya existe")
    db.close()

create_admin_user()

# Crear app
app = FastAPI(title=settings.PROJECT_NAME)

# Archivos estáticos
from fastapi.staticfiles import StaticFiles
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(api_router, prefix="/api/v1")

# ---------------------------------------------------------
# 🔥 GENERACIÓN AUTOMÁTICA DE EVENTOS CLIMÁTICOS REALES
# ---------------------------------------------------------
from app.services.climate_events import generar_eventos_reales
import asyncio
from datetime import date, timedelta

@app.on_event("startup")
async def generar_clima_inicial():
    """
    Genera eventos climáticos reales para los próximos 3 días
    al arrancar el servidor.
    """
    print(">>> Generando eventos climáticos reales (Open‑Meteo)...")
    db = SessionLocal()
    try:
        await generar_eventos_reales(db, days=3)
        print(">>> Eventos climáticos generados correctamente.")
    except Exception as e:
        print(">>> ERROR generando clima real:", e)
    finally:
        db.close()

# ---------------------------------------------------------

print(">>> RUTAS REGISTRADAS EN FASTAPI:")
for route in app.routes:
    methods = getattr(route, "methods", None)
    print(" -", route.path, methods)
