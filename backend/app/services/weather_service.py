import httpx
from app.core.config import settings


async def get_real_weather(lat: float, lon: float):
    """
    Obtiene clima actual, por horas y por días desde Open-Meteo.
    No requiere API key.
    """

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&current_weather=true"
        "&hourly=temperature_2m,relativehumidity_2m,windspeed_10m"
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
        "&timezone=auto"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()

    # Transformación al formato que espera tu backend y frontend
    return {
        "current": {
            "temp": data["current_weather"]["temperature"],
            "humidity": data["hourly"]["relativehumidity_2m"][0],
            "wind_speed": data["current_weather"]["windspeed"],
            "weather": [{"description": data["current_weather"]["weathercode"]}],
        },

        "hourly": [
            {
                "dt": data["hourly"]["time"][i],
                "temp": t,
                "humidity": h,
                "wind_speed": w,
            }
            for i, (t, h, w) in enumerate(
                zip(
                    data["hourly"]["temperature_2m"],
                    data["hourly"]["relativehumidity_2m"],
                    data["hourly"]["windspeed_10m"],
                )
            )
        ],

        "daily": [
            {
                "dt": data["daily"]["time"][i],
                "temp": {
                    "min": data["daily"]["temperature_2m_min"][i],
                    "max": data["daily"]["temperature_2m_max"][i],
                },
                "precipitation_sum": data["daily"]["precipitation_sum"][i],  # ✔ REAL
                "weather": [{"description": "forecast"}],
            }
            for i in range(len(data["daily"]["temperature_2m_max"]))
        ],

        "alerts": [],
    }
