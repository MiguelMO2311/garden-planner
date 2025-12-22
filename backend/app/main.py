# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
import app.models.user  # ensure models are imported
import app.models.plot



Base.metadata.create_all(bind=engine)
# Crear usuario admin si no existe
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "Content-Type"],
)

app.include_router(api_router)


@app.get("/health")
def health():
    return {"status": "ok"}
