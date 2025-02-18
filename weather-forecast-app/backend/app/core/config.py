from pydantic import BaseSettings

class Settings(BaseSettings):
    API_KEY: str
    WEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5"
    
    class Config:
        env_file = ".env"

settings = Settings()