from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_current_weather

router = APIRouter()

@router.get("/current")
async def current_weather(location: str):
    try:
        weather_data = await get_current_weather(location)
        if not weather_data:
            raise HTTPException(status_code=404, detail="Location not found")
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))