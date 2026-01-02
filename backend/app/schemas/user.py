# app/schemas/user.py
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str
    name: str | None = None
    avatar: str | None = None

class UserRead(UserBase):
    id: int
    email: str
    role: str
    name: str | None = None
    avatar: str | None = None

    class Config:
        from_attributes = True



class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
