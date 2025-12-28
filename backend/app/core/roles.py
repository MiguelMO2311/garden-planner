from fastapi import HTTPException, Depends
from app.core.auth import get_current_user

def require_role(role: str):
    def role_checker(user = Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(status_code=403, detail="No tienes permisos para esta acción")
        return user
    return role_checker
