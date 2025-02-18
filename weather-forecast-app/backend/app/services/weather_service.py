from typing import Dict, Any
import httpx
from fastapi import HTTPException
from app.core.config import settings

class WeatherService:
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"

    async def fetch_current_weather(self, location: str) -> Dict[str, Any]:
        url = f"{self.base_url}/weather?q={location}&appid={self.api_key}&units=metric"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error fetching current weather data")
            return response.json()

    async def fetch_weather_forecast(self, location: str) -> Dict[str, Any]:
        url = f"{self.base_url}/forecast?q={location}&appid={self.api_key}&units=metric"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error fetching weather forecast data")
            return response.json()

    async def fetch_location_data(self, location: str) -> Dict[str, Any]:
        url = f"{self.base_url}/find?q={location}&appid={self.api_key}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error fetching location data")
            return response.json()