from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import current, forecast, location

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(current.router, prefix="/api", tags=["current"])
app.include_router(forecast.router, prefix="/api", tags=["forecast"])
app.include_router(location.router, prefix="/api", tags=["location"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Weather Forecast API!"}