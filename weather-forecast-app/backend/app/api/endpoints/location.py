from fastapi import APIRouter, HTTPException
from typing import List
import httpx
from app.core.config import settings

router = APIRouter()

@router.get("/location", response_model=List[str])
async def get_location(city: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={settings.WEATHER_API_KEY}")
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Location not found or API request failed.")
        
        data = response.json()
        return [data['name'], data['sys']['country']]  # Return city name and country code as a simple example.