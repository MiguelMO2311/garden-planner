from fastapi import APIRouter

router = APIRouter(prefix="/cultivos", tags=["Cultivos"])

@router.get("/")
def get_cultivos():
    return [
        {"id": 1, "nombre": "Tomate"},
        {"id": 2, "nombre": "Pimiento"},
    ]
