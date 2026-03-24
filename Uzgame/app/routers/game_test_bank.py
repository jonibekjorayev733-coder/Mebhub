from typing import List, Optional
import random

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.game_test_bank import GameTestBank

router = APIRouter(prefix="/api/game-tests", tags=["game-tests"])


class GameTestCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_index: int
    explanation: Optional[str] = ""
    difficulty: Optional[str] = "Oson"
    points: Optional[int] = 10


class BulkSeedRequest(BaseModel):
    items: List[GameTestCreate]


def row_to_question(row: GameTestBank) -> dict:
    return row.to_question_payload()


@router.get("/{game_key}/questions")
def get_game_questions(
    game_key: str,
    count: int = 10,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(GameTestBank).filter(
        GameTestBank.game_key == game_key,
        GameTestBank.is_active.is_(True),
    )
    if difficulty:
        query = query.filter(GameTestBank.difficulty == difficulty)

    rows = query.all()
    if not rows:
        raise HTTPException(status_code=404, detail=f"{game_key} uchun savollar topilmadi")

    selected = random.sample(rows, min(count, len(rows)))
    return {
        "total": len(rows),
        "questions": [row_to_question(row) for row in selected],
    }


@router.post("/{game_key}/questions/add")
def add_game_question(game_key: str, payload: GameTestCreate, db: Session = Depends(get_db)):
    if payload.correct_index not in (0, 1, 2, 3):
        raise HTTPException(status_code=422, detail="correct_index 0..3 oralig'ida bo'lishi kerak")

    row = GameTestBank(
        game_key=game_key,
        question=payload.question,
        option_a=payload.option_a,
        option_b=payload.option_b,
        option_c=payload.option_c,
        option_d=payload.option_d,
        correct_index=payload.correct_index,
        explanation=payload.explanation or "",
        difficulty=payload.difficulty or "Oson",
        points=payload.points or 10,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return row_to_question(row)


@router.post("/{game_key}/questions/seed")
def seed_bulk_questions(game_key: str, payload: BulkSeedRequest, db: Session = Depends(get_db)):
    existing = db.query(GameTestBank).filter(GameTestBank.game_key == game_key).count()
    if existing > 0:
        return {
            "seeded": False,
            "message": f"{game_key} uchun allaqachon {existing} ta savol bor",
        }

    rows: List[GameTestBank] = []
    for item in payload.items:
        if item.correct_index not in (0, 1, 2, 3):
            continue
        rows.append(
            GameTestBank(
                game_key=game_key,
                question=item.question,
                option_a=item.option_a,
                option_b=item.option_b,
                option_c=item.option_c,
                option_d=item.option_d,
                correct_index=item.correct_index,
                explanation=item.explanation or "",
                difficulty=item.difficulty or "Oson",
                points=item.points or 10,
            )
        )

    if not rows:
        raise HTTPException(status_code=400, detail="Seed uchun to'g'ri savollar yuborilmadi")

    db.add_all(rows)
    db.commit()

    return {
        "seeded": True,
        "game_key": game_key,
        "count": len(rows),
    }


@router.get("/{game_key}/questions/all")
def get_all_for_game(game_key: str, db: Session = Depends(get_db)):
    rows = (
        db.query(GameTestBank)
        .filter(GameTestBank.game_key == game_key)
        .order_by(GameTestBank.id.asc())
        .all()
    )
    return {
        "total": len(rows),
        "questions": [row_to_question(row) for row in rows],
    }
