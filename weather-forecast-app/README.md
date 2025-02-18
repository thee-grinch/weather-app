# Weather Forecast App

## Overview
Weather Forecast App is a modern web application that provides real-time weather data and forecasts using FastAPI for the backend and a responsive frontend built with HTML, CSS, and JavaScript. The application features a clean and professional design, offering users an intuitive experience for checking weather conditions and forecasts.

## Features
- Fetch current weather details including temperature, humidity, wind speed, and air quality.
- View hourly and daily weather forecasts.
- Search for weather information by city.
- Responsive design with a modern UI and dark mode support.
- Smooth animations and transitions for a better user experience.

## Project Structure
```
weather-forecast-app
├── backend
│   ├── app
│   │   ├── main.py                # Entry point for the FastAPI application
│   │   ├── api
│   │   │   ├── endpoints
│   │   │   │   ├── current.py     # Endpoint for current weather data
│   │   │   │   ├── forecast.py    # Endpoint for weather forecasts
│   │   │   │   └── location.py    # Endpoint for location searches
│   │   ├── core
│   │   │   ├── config.py          # Configuration settings
│   │   │   └── utils.py           # Utility functions
│   │   ├── models
│   │   │   └── weather.py         # Data models for weather data
│   │   ├── services
│   │   │   └── weather_service.py  # Functions to interact with the weather API
│   │   └── main.py                # Main application file
│   ├── requirements.txt            # Backend dependencies
│   └── README.md                   # Backend documentation
├── frontend
│   ├── index.html                  # Main HTML file for the frontend
│   ├── css
│   │   └── styles.css              # CSS styles for the frontend
│   ├── js
│   │   └── app.js                  # JavaScript code for the frontend
│   └── README.md                   # Frontend documentation
├── .gitignore                      # Files to ignore in version control
└── README.md                       # Overall project documentation
```

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend
1. Open `index.html` in a web browser to view the application.
2. Ensure the backend is running to fetch weather data.

## Usage
- Use the search bar to enter a city name and fetch the current weather and forecasts.
- Toggle between light and dark modes for a personalized experience.
- The application refreshes weather data every 10 minutes for real-time updates.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.