from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_weather_forecast

router = APIRouter()

@router.get("/forecast")
async def forecast(location: str):
    try:
        hourly_forecast, daily_forecast = await get_weather_forecast(location)
        return {
            "hourly": hourly_forecast,
            "daily": daily_forecast
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))