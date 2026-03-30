from fastapi import APIRouter

router = APIRouter()

@router.get("/games")
def get_games():
    return {"games": []}
