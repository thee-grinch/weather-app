from fastapi import FastAPI
from routes import weather, pages, user
from fastapi.staticfiles import StaticFiles

from database import engine
from models import Base



app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(weather.router, prefix="/api")
app.include_router(user.router, prefix="/api")

app.include_router(pages.router)

app.mount("/static", StaticFiles(directory="static"), name="static")

