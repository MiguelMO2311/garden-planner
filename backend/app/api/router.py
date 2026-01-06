from fastapi import APIRouter

from app.api.v1 import (
    auth,
    crop,
    pest,
    irrigation,
    calendar,
    clima,
    crop_plan,
    dashboard,
    seasonal,
    plots,
    cultivos as cultivos_router,
    tareas,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(crop.router, prefix="/crop", tags=["crop"])
api_router.include_router(pest.router, prefix="/pest", tags=["pest"])
api_router.include_router(irrigation.router, prefix="/irrigation", tags=["irrigation"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
api_router.include_router(clima.router, prefix="/clima", tags=["clima"])
api_router.include_router(crop_plan.router, prefix="/crop-plan", tags=["crop-plan"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(seasonal.router, prefix="/seasonal", tags=["seasonal"])

api_router.include_router(plots.router, prefix="/plots", tags=["plots"])
api_router.include_router(cultivos_router.router, prefix="/cultivos", tags=["cultivos"])
api_router.include_router(tareas.router, prefix="/tareas", tags=["tareas"])
