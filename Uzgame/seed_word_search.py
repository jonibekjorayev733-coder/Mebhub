#!/usr/bin/env python3
"""
Script to seed the database with word search game questions.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import sessionLocal
from app.models.game import GameQuestion

# Mock word search questions in Uzbek
WORD_SEARCH_QUESTIONS = [
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "AMAKL so'zidan qaysi harfni olib tashlash kerak?",
        "options": ["A", "M", "K", "L"],
        "correct_answer": 1,
        "difficulty": "Oson",
        "explanation": "AMAKL → AKAL (to'g'ri so'z)",
        "points": 10,
        "order_index": 1,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "MKIRTOB harflaridan to'g'ri so'z yasang",
        "options": ["KORIT", "KITOB", "Mkitob", "TURK"],
        "correct_answer": 1,
        "difficulty": "Oson",
        "explanation": "MKIRTOB → KITOB",
        "points": 10,
        "order_index": 2,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "ORADYA so'zini to'g'ri qo'yib yozing",
        "options": ["ORAD", "ORDA", "AROD", "ROAD"],
        "correct_answer": 1,
        "difficulty": "Oson",
        "explanation": "ORADYA → ORDA",
        "points": 10,
        "order_index": 3,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "DAYNM harflaridan to'g'ri so'z yasang",
        "options": ["MANYD", "MANNY", "MANDA", "MADYN"],
        "correct_answer": 2,
        "difficulty": "Oson",
        "explanation": "DAYNM → MANDA",
        "points": 10,
        "order_index": 4,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "MALSOQ qaysi so'zning to'g'ri yozuvi?",
        "options": ["QOSLA", "SOQLAM", "QOLMAS", "MALQO"],
        "correct_answer": 1,
        "difficulty": "Oson",
        "explanation": "MALSOQ → SOQLAM",
        "points": 10,
        "order_index": 5,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 1,
        "question_text": "TUFIRB harflarini qayta joylashtiring",
        "options": ["TURBI", "FRITU", "FRUIT", "BURIT"],
        "correct_answer": 2,
        "difficulty": "Oson",
        "explanation": "TUFIRB → FRUIT",
        "points": 10,
        "order_index": 6,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 2,
        "question_text": "DUXSOM so'zni to'g'ri joylashtiring",
        "options": ["DUXSOM", "MOZHDU", "UXDUM", "MAXDUM"],
        "correct_answer": 1,
        "difficulty": "O'rta",
        "explanation": "MOZHDU — Mожду (orasida)",
        "points": 15,
        "order_index": 7,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 2,
        "question_text": "KITOB so'zini aralashtirib yozing",
        "options": ["TIKOB", "BOTIK", "OKTIB", "BOKTI"],
        "correct_answer": 0,
        "difficulty": "O'rta",
        "explanation": "Harflar aralash",
        "points": 15,
        "order_index": 8,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 2,
        "question_text": "XONA so'zidan bir harf qo'shib yangi so'z yasang",
        "options": ["XONAD", "XONAK", "XOZNA", "EXONA"],
        "correct_answer": 3,
        "difficulty": "O'rta",
        "explanation": "E + XONA = EXONA",
        "points": 15,
        "order_index": 9,
    },
    {
        "game_id": "soz_qidiruv",
        "stage_id": 2,
        "question_text": "UQITUVCHI so'zida nechta unli bor?",
        "options": ["3", "4", "5", "6"],
        "correct_answer": 2,
        "difficulty": "O'rta",
        "explanation": "U, I, U, I — 4 ta unli (U-I-U-CHI)",
        "points": 15,
        "order_index": 10,
    },
]

def seed_questions():
    """Seed word search questions into the database"""
    db = sessionLocal()
    try:
        # Check if data already exists
        existing_count = db.query(GameQuestion).filter(
            GameQuestion.game_id == "soz_qidiruv"
        ).count()
        
        if existing_count > 0:
            print(f"⚠ Database already contains {existing_count} word search questions")
            response = input("Do you want to overwrite? (y/n): ")
            if response.lower() != 'y':
                print("Aborted.")
                return
            # Delete existing questions
            db.query(GameQuestion).filter(
                GameQuestion.game_id == "soz_qidiruv"
            ).delete()
            print("Deleted existing questions")
        
        # Add new questions
        for q_data in WORD_SEARCH_QUESTIONS:
            question = GameQuestion(
                game_id=q_data["game_id"],
                stage_id=q_data.get("stage_id", 1),
                question_text=q_data["question_text"],
                options=q_data["options"],
                correct_answer=q_data["correct_answer"],
                difficulty=q_data["difficulty"],
                explanation=q_data["explanation"],
                points=q_data["points"],
                order_index=q_data["order_index"],
            )
            db.add(question)
        
        db.commit()
        print(f"✓ Successfully seeded {len(WORD_SEARCH_QUESTIONS)} word search questions")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    try:
        seed_questions()
    except Exception as e:
        print(f"Failed to seed database: {e}")
        sys.exit(1)
