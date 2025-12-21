from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str = "user"  # opcional, por defecto user

class UserRead(UserBase):
    id: int
    role: str

    model_config = {
        "from_attributes": True
    }
