from pydantic import BaseModel

class PlagaRead(BaseModel):
    id: int
    nombre: str
    descripcion: str | None = None

    class Config:
        from_attributes = True
