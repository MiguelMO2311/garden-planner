# app/core/deps.py

from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.database import get_db

"""
Este archivo contiene SOLO dependencias auxiliares.
NO debe existir aquí ningún get_current_user.
La autenticación se gestiona exclusivamente en app/core/auth.py
"""


# Dependencia estándar para obtener la sesión de BD
def get_db_dep(db: Session = Depends(get_db)):
    try:
        yield db
    finally:
        db.close()
