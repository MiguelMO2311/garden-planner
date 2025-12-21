from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.core.database import Base, engine

# Routers
from app.api.plot import router as plot_router
from app.api.crop import router as crop_router
from app.api.crop_plan import router as crop_plan_router
from app.api.irrigation import router as irrigation_router
from app.api.pest import router as pest_router
from app.api.seasonal import router as seasonal_router
from app.api.calendar import router as calendar_router
from app.api.dashboard import router as dashboard_router
from app.api.auth import router as auth_router
from app.api import clima



app = FastAPI(title="Garden Planner API")

# -----------------------------
# CORS (Frontend: React + Vite)
# -----------------------------
origins = [
    "http://localhost:5173",  # Vite
    "http://localhost:3000",  # fallback
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Crear tablas
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# Registrar routers
# -----------------------------
app.include_router(auth_router)
app.include_router(plot_router)
app.include_router(crop_router)
app.include_router(crop_plan_router)
app.include_router(irrigation_router)
app.include_router(pest_router)
app.include_router(seasonal_router)
app.include_router(calendar_router)
app.include_router(dashboard_router)
app.include_router(clima.router)

# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
def health():
    return {"status": "ok"}
