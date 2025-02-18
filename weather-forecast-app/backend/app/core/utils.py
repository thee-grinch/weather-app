def format_weather_data(data):
    # Format the weather data received from the API
    formatted_data = {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"],
        "air_quality": None,  # Placeholder for air quality data
    }
    return formatted_data

def handle_api_error(error):
    # Handle errors from API requests
    if error.response:
        return {"error": error.response.json().get("message", "Error occurred")}
    return {"error": "An unexpected error occurred"}

def validate_location(location):
    # Validate the location input
    if not location or not isinstance(location, str):
        raise ValueError("Invalid location provided")
    return location.strip()