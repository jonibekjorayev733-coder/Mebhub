from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.game import GameQuestion, GameProgress
from app.schemas.gameschemas import Question, GameProgress as GameProgressSchema, GameProgressCreate
from typing import List
import random

router = APIRouter(prefix="/games", tags=["games"])

# Physics questions database
PHYSICS_QUESTIONS = [
    # Easy
    {"q": "F = ma bo'yicha, agar m=5kg, a=2m/s² bo'lsa F nima?", "opts": ["5 N", "10 N", "7 N", "15 N"], "correct": 1, "formula": "F = m × a = 5 × 2 = 10 N", "exp": "Nyuton qonuni: kuch = massa × tezlanish"},
    {"q": "Tezlik formulasi qaysi?", "opts": ["v = s/t", "v = a/t", "v = m/t", "v = F/t"], "correct": 0, "formula": "v = s/t (masofaning vaqtga nisbati)", "exp": "Tezlik - vaqt birligida o'tilgan masofa"},
    {"q": "Eneriya ni SI birligida nima deyiladi?", "opts": ["Kilojoule", "Joul", "Vatt", "Kat"], "correct": 1, "formula": "E = J (Joul)", "exp": "Energiya birligi - Joul (J)"},
    {"q": "Og'irlik tezlanuvi g ni qiymatini toping", "opts": ["5.8 m/s²", "9.8 m/s²", "12.3 m/s²", "7.5 m/s²"], "correct": 1, "formula": "g ≈ 9.8 m/s²", "exp": "Yer yuzasida og'irlik tezlanuvi taxminan 9.8 m/s²"},
    {"q": "Moddaning og'irligi P = ?", "opts": ["P = m/g", "P = m × g", "P = g/m", "P = m + g"], "correct": 1, "formula": "P = m × g", "exp": "Og'irlik = massa × og'irlik tezlanuvi"},
    {"q": "Harorat birligini toping", "opts": ["Vatt", "Joul", "Kelvin", "Newton"], "correct": 2, "formula": "T = K (Kelvin)", "exp": "SI sistemada harorat - Kelvin"},
    {"q": "Zichlik formulasi nima?", "opts": ["ρ = m/V", "ρ = V/m", "ρ = m + V", "ρ = m - V"], "correct": 0, "formula": "ρ = m/V (massa/hajm)", "exp": "Zichlik - massaning hajmga nisbati"},
    {"q": "Bosim formulasi qaysi?", "opts": ["P = F/S", "P = F × S", "P = S/F", "P = F + S"], "correct": 0, "formula": "P = F/S (kuch/yuzasi)", "exp": "Bosim - kuchning yuzaga nisbati"},
    {"q": "Murakkab harakatda tezlikni toping", "opts": ["v = a × t", "v = v0 + at", "v = s × t", "v = g × t"], "correct": 1, "formula": "v = v0 + at", "exp": "Oxirgi tezlik = boshlangich tezlik + tezlanish × vaqt"},
    {"q": "Masofani toping: t=3s, a=2m/s²", "opts": ["3 m", "6 m", "9 m", "12 m"], "correct": 2, "formula": "s = (1/2)at² = (1/2)×2×9 = 9 m", "exp": "Boshlang'ich tezlik noldan masofa = 0.5 × a × t²"},
    # Medium
    {"q": "Kuch va tezlanish orasidagi munosabat?", "opts": ["Teskari", "To'g'ri", "Aylana", "Chunqi"], "correct": 1, "formula": "F = ma - to'g'ri proportsional", "exp": "Kuch ortsa, tezlanish ortadi (m o'zgarmaganda)"},
    {"q": "Joul-Lents qonuni nima?", "opts": ["Q = I²Rt", "Q = IRt", "Q = I/Rt", "Q = I + Rt"], "correct": 0, "formula": "Q = I²Rt (Joul-Lents)", "exp": "Issiqlik = tok² × qarshilik × vaqt"},
    {"q": "Magnit maydonining SI birligi?", "opts": ["Ampere", "Tesla", "Veber", "Farad"], "correct": 1, "formula": "B = T (Tesla)", "exp": "Magnit induksiyasi - Tesla (T)"},
    {"q": "Fotoni energiyasi E = ?", "opts": ["E = hf", "E = hv", "E = h/f", "E = f/h"], "correct": 0, "formula": "E = hf (Plank formulasi)", "exp": "Foton energiyasi = Plank o'zgarmagichi × chastota"},
    {"q": "Reliatyvistik massa nima?", "opts": ["m' = m × c", "m' = m/√(1-v²/c²)", "m' = m × v", "m' = m/c"], "correct": 1, "formula": "m' = m₀/√(1-v²/c²)", "exp": "Tezlik ortgani sayin, massa o'sadi"},
    # Hard
    {"q": "Shrodin'jer tenglamasi nima?", "opts": ["iℏ ∂ψ/∂t = Ĥψ", "E = mc²", "F = ma", "P = F/S"], "correct": 0, "formula": "iℏ ∂ψ/∂t = Ĥψ", "exp": "Kvant mexanikasining asosiy tenglamasi"},
    {"q": "Bohr modeli elektron energiyasi?", "opts": ["E = 13.6/n² eV", "E = mc²", "E = hf", "E = kT"], "correct": 0, "formula": "En = -13.6 eV / n²", "exp": "Bohr modelida energiya darajalarni aniqlaydi"},
    {"q": "Maxwell tenglamalari soni?", "opts": ["2", "3", "4", "5"], "correct": 2, "formula": "4 ta Maxwell tenglamasi", "exp": "Elektromagnetizm asosi - 4 ta integral tenglamalar"},
]

@router.get("/questions/{game_name}", response_model=List[dict])
async def get_game_questions(
    game_name: str,
    difficulty: str = Query("Oson"),
    section: int = Query(None),
    db: Session = Depends(get_db)
):
    """Fetch questions for a game, optionally filtered by section"""
    query = db.query(GameQuestion).filter(
        GameQuestion.game_id == game_name,
        GameQuestion.difficulty == difficulty
    )
    # Remove section filter since the model doesn't have section_number field
    # if section is not None:
    #     query = query.filter(GameQuestion.section_number == section)

    db_questions = query.order_by(GameQuestion.order_index).all()

    return [
        {
            "id": q.id,
            "q": q.question_text,
            "opts": q.options,
            "correct": q.correct_answer,
            "difficulty": q.difficulty,
            "explanation": q.explanation or "",
            "points": q.points
        }
        for q in db_questions
    ]

@router.post("/seed")
async def seed_questions(questions: List[dict], db: Session = Depends(get_db)):
    """Seed questions into the database from frontend initial data"""
    for q_data in questions:
        q = GameQuestion(
            game_name=q_data["game_name"],
            question_text=q_data["q"],
            options=q_data["opts"],
            correct_answer=q_data["correct"],
            difficulty=q_data["difficulty"],
            formula=q_data.get("formula"),
            explanation=q_data.get("explanation")
        )
        db.add(q)
    db.commit()
    return {"status": "success", "message": f"Seeded {len(questions)} questions"}

# Save game progress
@router.post("/progress", response_model=GameProgressSchema)
async def save_game_progress(progress: GameProgressCreate, db: Session = Depends(get_db)):
    """O'yin natijasini saqlash"""
    
    db_progress = GameProgress(
        user_id=progress.user_id,
        game_name=progress.game_name,
        score=progress.score,
        total_questions=progress.total_questions,
        difficulty=progress.difficulty,
        time_spent=progress.time_spent,
        completed=True
    )
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

# Get user stats
@router.get("/stats/{user_id}")
async def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """Foydalanuvchining statistikasi"""
    
    stats = db.query(
        GameProgress.game_name,
        func.avg(GameProgress.score).label("avg_score"),
        func.count(GameProgress.id).label("games_played"),
        func.sum(GameProgress.time_spent).label("total_time")
    ).filter(GameProgress.user_id == user_id).group_by(GameProgress.game_name).all()
    
    return {
        "user_id": user_id,
        "games": [
            {
                "name": s.game_name,
                "avg_score": float(s.avg_score),
                "games_played": s.games_played,
                "total_time": s.total_time
            }
            for s in stats
        ]
    }

# Leaderboard
@router.get("/leaderboard/{game_name}")
async def get_leaderboard(game_name: str, db: Session = Depends(get_db)):
    """O'yin uchun leaderboard"""
    
    top_scores = db.query(
        GameProgress.user_id,
        func.max(GameProgress.score).label("best_score"),
        func.avg(GameProgress.score).label("avg_score")
    ).filter(GameProgress.game_name == game_name).group_by(
        GameProgress.user_id
    ).order_by(
        func.max(GameProgress.score).desc()
    ).limit(10).all()
    
    return {
        "game": game_name,
        "leaderboard": [
            {
                "rank": i + 1,
                "user_id": s.user_id,
                "best_score": s.best_score,
                "avg_score": float(s.avg_score)
            }
            for i, s in enumerate(top_scores)
        ]
    }
