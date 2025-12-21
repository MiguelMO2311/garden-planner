from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENWEATHER_API_KEY: str = ""
    LATITUD: float = 40.4168
    LONGITUD: float = -3.7038

    class Config:
        env_file = "C:/Users/Usuario/Desktop/Miguel/Huerto/backend/.env"

settings = Settings()


OPENWEATHER_API_KEY="xxxxxxxxxxxxxx"
