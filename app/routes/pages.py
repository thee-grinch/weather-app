from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()


@router.get("/", response_class=HTMLResponse)
async def get_home():
    with open("templates/index.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)

@router.get("/auth", response_class=HTMLResponse)
async def get_auth():
    with open("templates/login-page.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)