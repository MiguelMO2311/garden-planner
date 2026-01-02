# app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token
from app.core.deps import get_current_user

# URL base de tu API (AJUSTA EN PRODUCCIÓN)
API_BASE_URL = "http://localhost:8000"

router = APIRouter(tags=["Auth"])


# ============================================================
#  GET /me  → Devuelve el usuario logueado con avatar correcto
# ============================================================
@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    # Forzar avatar del admin SIEMPRE
    if current_user.email == "admin@example.com":
        current_user.avatar = f"{API_BASE_URL}/static/avatars/user1.jpg"
        return current_user

    # Para otros usuarios, si no tienen avatar, usar default
    if not current_user.avatar:
        current_user.avatar = f"{API_BASE_URL}/static/avatars/default.jpg"

    return current_user


# ============================================================
#  POST /register  → Registrar usuario
# ============================================================
@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Avatar por defecto si no se envía uno
    default_avatar = f"{API_BASE_URL}/static/avatars/default.jpg"

    user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role="user",
        name=user_in.name,
        avatar=user_in.avatar or default_avatar,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ============================================================
#  POST /login  → Login y generación de token
# ============================================================
@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(user.id)
    return {"access_token": access_token, "token_type": "bearer"}
