from pydantic import BaseModel

class EnfermedadRead(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None

    class Config:
        from_attributes = True
