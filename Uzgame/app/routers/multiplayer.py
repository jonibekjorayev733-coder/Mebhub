from fastapi import APIRouter

router = APIRouter()

@router.get("/multiplayer")
def get_multiplayer():
    return {"rooms": []}
