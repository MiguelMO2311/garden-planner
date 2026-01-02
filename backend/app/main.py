from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine

# IMPORTA EL MÓDULO DE MODELOS ANTES DE create_all
from app.models import tarea

Base.metadata.create_all(bind=engine)

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User

from fastapi.staticfiles import StaticFiles
import os


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

app = FastAPI(title=settings.PROJECT_NAME)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "Content-Type"],
)

app.include_router(api_router, prefix="/api/v1")
