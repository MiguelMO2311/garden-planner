from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User

# ---------------------------------------------------------
# IMPORTA TODOS LOS MODELOS ANTES DE create_all
# ---------------------------------------------------------
from app.models import (
    user,
    irrigation,
    tarea,
    plot,
    cultivo_tipo,
    cultivo_parcela,
    cultivo_plan,
    pest,
    calendar_event,
    evento,
    climate_event,
)

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

print(">>> RUTAS REGISTRADAS EN FASTAPI:")
for route in app.routes:
    methods = getattr(route, "methods", None)
    print(" -", route.path, methods)
