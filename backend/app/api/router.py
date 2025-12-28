from fastapi import APIRouter
from app.api.v1 import auth


from app.api.v1 import (
    crop,
    pest,
    irrigation,
    calendar,
    clima,
    crop_plan,
    dashboard,
    seasonal,
    tarea,
    auth,
)

api_router = APIRouter()

api_router.include_router(crop.router)
api_router.include_router(pest.router)
api_router.include_router(irrigation.router)
api_router.include_router(calendar.router)
api_router.include_router(clima.router)
api_router.include_router(crop_plan.router)
api_router.include_router(dashboard.router)
api_router.include_router(seasonal.router)
api_router.include_router(tarea.router)
api_router.include_router(auth.router)   # ← AÑADIDO
