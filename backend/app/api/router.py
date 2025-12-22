from app.api.v1 import auth, plots, cultivos
from fastapi import APIRouter


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(plots.router)
api_router.include_router(cultivos.router)
