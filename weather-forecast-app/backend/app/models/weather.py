from pydantic import BaseModel
from typing import List, Optional

class CurrentWeather(BaseModel):
    temperature: float
    feels_like: float
    description: str
    humidity: int
    wind_speed: float
    air_quality_index: Optional[int] = None
    visibility: Optional[float] = None
    pressure: Optional[int] = None

class HourlyForecast(BaseModel):
    time: str
    temperature: float
    description: str
    wind_speed: float
    humidity: int

class DailyForecast(BaseModel):
    date: str
    high: float
    low: float
    description: str

class WeatherResponse(BaseModel):
    current: CurrentWeather
    hourly: List[HourlyForecast]
    daily: List[DailyForecast]