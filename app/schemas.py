from pydantic import BaseModel
from typing import List, Optional, Dict


class CurrentWeatherResponse(BaseModel):
    wind_kph: float
    air_quality: Dict
    humidity: int
    visibility_km: float
    pressure_mb: float
    temp_c: float
    sunrise: str
    sunset: str
    location: Dict

class ForecastResponse(BaseModel):
    period: str
    data: List[Dict]

# Schemas
class User(BaseModel):
    email: str
    username: str
    is_active: bool

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserInDB(UserCreate):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None