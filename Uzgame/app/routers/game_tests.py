from fastapi import APIRouter

router = APIRouter()

@router.get("/game-tests")
def get_game_tests():
    return {"tests": []}
