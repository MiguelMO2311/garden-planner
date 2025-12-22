# app/core/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- Proyecto ---
    PROJECT_NAME: str = "Garden Planner API"
    API_V1_PREFIX: str = "/api/v1"

    # --- Base de datos ---
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./app.db"

    # --- Seguridad JWT ---
    SECRET_KEY: str = "Meneses23@"   # cámbiala en producción
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 día

    # --- OpenWeather ---
    OPENWEATHER_API_KEY: str | None = None
    LATITUD: float | None = None
    LONGITUD: float | None = None

    # --- Configuración Pydantic v2 ---
    model_config = {
        "extra": "ignore",     # Ignora variables extra en .env
        "env_file": ".env",    # Carga automática del .env
    }


settings = Settings()
