import requests
from datetime import datetime, timedelta
from app.core.config import settings

def get_weather_forecast(lat: float, lon: float):
    url = (
        f"https://api.openweathermap.org/data/2.5/forecast?"
        f"lat={lat}&lon={lon}&appid={settings.OPENWEATHER_API_KEY}&units=metric&lang=es"
    )

    res = requests.get(url)
    res.raise_for_status()
    return res.json()
