import httpx
from datetime import datetime

async def fetch_weather_forecast(latitude: float, longitude: float, days: int):
    """
    Fetches weather forecast data from the public Open-Meteo API.
    Does not require authentication.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["temperature_2m_max", "precipitation_sum", "wind_speed_10m_max"],
        "timezone": "auto",
        "forecast_days": days
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
    daily_data = data.get("daily", {})
    times = daily_data.get("time", [])
    temps = daily_data.get("temperature_2m_max", [])
    precips = daily_data.get("precipitation_sum", [])
    winds = daily_data.get("wind_speed_10m_max", [])
    
    forecasts = []
    for i in range(len(times)):
        forecasts.append({
            # The API returns dates in format 'YYYY-MM-DD'
            "target_date": datetime.strptime(times[i], "%Y-%m-%d"),
            "temperature": temps[i],
            "precipitation": precips[i],
            "wind_speed": winds[i]
        })
        
    return forecasts
