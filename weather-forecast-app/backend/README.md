# Weather Forecast App Backend

This is the backend for the Weather Forecast App, built using FastAPI. The backend fetches real-time weather data from a third-party API and provides endpoints for the frontend to interact with.

## Features

- **Current Weather Data**: Fetches current weather details including temperature, humidity, wind speed, and air quality.
- **Weather Forecast**: Provides hourly and daily weather forecasts.
- **Location Search**: Allows users to search for weather data by city name.

## API Endpoints

### GET /current
Fetches current weather details.

**Response**:
- Temperature
- Humidity
- Wind Speed
- Air Quality Index

### GET /forecast
Returns hourly and daily weather forecasts.

**Response**:
- Hourly forecast data
- Daily forecast data

### GET /location
Handles user searches for different cities.

**Response**:
- Location data based on user input

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-forecast-app.git
   ```

2. Navigate to the backend directory:
   ```
   cd weather-forecast-app/backend
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

5. Access the API documentation at `http://127.0.0.1:8000/docs`.

## Error Handling

The backend includes error handling for:
- Invalid locations
- Failed API requests

## CORS

CORS is enabled to allow the frontend to interact smoothly with the backend.

## License

This project is licensed under the MIT License.