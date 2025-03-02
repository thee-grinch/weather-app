from fastapi import APIRouter, HTTPException
from schemas import CurrentWeatherResponse, ForecastResponse
import requests
from datetime import datetime, timedelta
from pytz import timezone

router = APIRouter()

BASE_URL = "http://api.weatherapi.com/v1"
WEATHER_API_KEY = "23a4ddb235f349aa90f195146251902"

@router.get("/current/{location}")
async def get_current_weather(location: str):
    try:
        # Get current weather data
        current_response = requests.get(
            f"{BASE_URL}/current.json?key={WEATHER_API_KEY}&q={location}&aqi=yes"
        )
        current_response.raise_for_status()
        current_data = current_response.json()

        # Get forecast data for sunrise/sunset and next hour
        forecast_response = requests.get(
            f"{BASE_URL}/forecast.json?key={WEATHER_API_KEY}&q={location}&days=1"
        )
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()

        # Get timezone from API response
        location_tz = timezone(current_data["location"]["tz_id"])
        current_time = datetime.now(location_tz)
        next_hour_time = (current_time + timedelta(hours=1)).strftime("%H:00")

        # Find next hour's forecast in the correct timezone
        next_hour_forecast = None
        for hour in forecast_data["forecast"]["forecastday"][0]["hour"]:
            hour_time = datetime.strptime(hour["time"], "%Y-%m-%d %H:%M")
            hour_time = location_tz.localize(hour_time)
            if hour_time.strftime("%H:00") == next_hour_time:
                next_hour_forecast = hour
                break

        # Build response data
        response_data = {
            "collected_at": current_time.strftime("%Y-%m-%d %H:%M"),
            "wind_kph": current_data["current"]["wind_kph"],
            "air_quality": current_data["current"].get("air_quality", {}),
            "feels_like_c": current_data["current"]["feelslike_c"],
            "condition_text": current_data["current"]["condition"]["text"],
            "humidity": current_data["current"]["humidity"],
            "visibility_km": current_data["current"]["vis_km"],
            "pressure_mb": current_data["current"]["pressure_mb"],
            "temp_c": current_data["current"]["temp_c"],
            "sunrise": forecast_data["forecast"]["forecastday"][0]["astro"]["sunrise"],
            "sunset": forecast_data["forecast"]["forecastday"][0]["astro"]["sunset"],
            "location": {
                "name": current_data["location"]["name"],
                "region": current_data["location"]["region"],
                "country": current_data["location"]["country"],
                "timezone": current_data["location"]["tz_id"]
            },
            "next_hour_forecast": {
                "time": next_hour_time,
                "temp_c": next_hour_forecast["temp_c"] if next_hour_forecast else None,
                "condition": {
                    "text": next_hour_forecast["condition"]["text"] if next_hour_forecast else None,
                    "icon": next_hour_forecast["condition"]["icon"] if next_hour_forecast else None
                }
            } if next_hour_forecast else None
        }

        print("API Response:", response_data)  # Debugging log
        return response_data
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except KeyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Missing expected data field: {str(e)}"
        )


# Updated current weather endpoint
@router.get("/scurrent/{location}")
async def sget_current_weather(location: str):
    try:
        # Get current weather data
        current_response = requests.get(
            f"{BASE_URL}/current.json?key={WEATHER_API_KEY}&q={location}&aqi=yes"
        )
        current_response.raise_for_status()
        current_data = current_response.json()

        # Get forecast data for sunrise/sunset
        forecast_response = requests.get(
            f"{BASE_URL}/forecast.json?key={WEATHER_API_KEY}&q={location}&days=1"
        )
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()

        print({
            "wind_kph": current_data["current"]["wind_kph"],
            "air_quality": current_data["current"]["air_quality"],
            "feels_like_c": current_data["current"]["feelslike_c"],
            "condition_text": current_data["current"]["condition"]["text"],
            "humidity": current_data["current"]["humidity"],
            "visibility_km": current_data["current"]["vis_km"],
            "pressure_mb": current_data["current"]["pressure_mb"],
            "temp_c": current_data["current"]["temp_c"],
            "sunrise": forecast_data["forecast"]["forecastday"][0]["astro"]["sunrise"],
            "sunset": forecast_data["forecast"]["forecastday"][0]["astro"]["sunset"],
            "location": {
                "name": current_data["location"]["name"],
                "region": current_data["location"]["region"],
                "country": current_data["location"]["country"]
            }
        })
        return {
            "wind_kph": current_data["current"]["wind_kph"],
            "air_quality": current_data["current"]["air_quality"],
            "feels_like_c": current_data["current"]["feelslike_c"],
            "condition_text": current_data["current"]["condition"]["text"],
            "humidity": current_data["current"]["humidity"],
            "visibility_km": current_data["current"]["vis_km"],
            "pressure_mb": current_data["current"]["pressure_mb"],
            "temp_c": current_data["current"]["temp_c"],
            "sunrise": forecast_data["forecast"]["forecastday"][0]["astro"]["sunrise"],
            "sunset": forecast_data["forecast"]["forecastday"][0]["astro"]["sunset"],
            "location": {
                "name": current_data["location"]["name"],
                "region": current_data["location"]["region"],
                "country": current_data["location"]["country"]
            }
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except KeyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Missing expected data field: {str(e)}"
        )
   
@router.get("/forecast/{location}")
async def get_forecast(location: str, period: str = "today"):
    try:
        if period == "monthly":
            days = 30
        elif period == "10-days":
            days = 10
        else:
            days = 3  # WeatherAPI free tier allows up to 3 days
            
        response = requests.get(
            f"{BASE_URL}/forecast.json?key={WEATHER_API_KEY}&q={location}&days={days}&aqi=yes&alerts=no"
        )
        response.raise_for_status()
        data = response.json()
        
        forecast_data = []
        
        if period == "today":
            forecast_data = [{
                "time": hour["time"].split()[1],
                "temp_c": hour["temp_c"],
                "condition": {
                    "text": hour["condition"]["text"],
                    "icon": hour["condition"]["icon"]
                },
                "wind_kph": hour["wind_kph"],
                "humidity": hour["humidity"]
            } for hour in data["forecast"]["forecastday"][0]["hour"]]
            
        elif period == "tomorrow":
            if len(data["forecast"]["forecastday"]) > 1:
                forecast_data = [{
                    "time": hour["time"].split()[1],
                    "temp_c": hour["temp_c"],
                    "condition": {
                        "text": hour["condition"]["text"],
                        "icon": hour["condition"]["icon"]
                    },
                    "wind_kph": hour["wind_kph"],
                    "humidity": hour["humidity"]
                } for hour in data["forecast"]["forecastday"][1]["hour"]]
        
        elif period in ["10-days", "monthly"]:
            forecast_data = [{
                "date": day["date"],
                "max_temp": day["day"]["maxtemp_c"],
                "min_temp": day["day"]["mintemp_c"],
                "condition": {
                    "text": day["day"]["condition"]["text"],
                    "icon": day["day"]["condition"]["icon"]
                },
                "sunrise": day["astro"]["sunrise"],
                "sunset": day["astro"]["sunset"]
            } for day in data["forecast"]["forecastday"]]
        
        return {
            "period": period,
            "data": forecast_data[:10] if period == "10-days" else forecast_data
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))