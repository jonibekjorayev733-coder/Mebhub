from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from datetime import datetime

from app.database import get_db
from app.models.testnew import TestNew
from pydantic import BaseModel

router = APIRouter(prefix="/api/baraban", tags=["baraban"])


# ===== PYDANTIC SCHEMAS =====

class TestNewCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_index: int
    explanation: Optional[str] = ""
    difficulty: Optional[str] = "Oson"
    points: Optional[int] = 10

class TestNewResponse(BaseModel):
    id: int
    q: str
    opts: List[str]
    correct: int
    explanation: str
    difficulty: str
    points: int

    class Config:
        from_attributes = True

class TestNewListResponse(BaseModel):
    total: int
    questions: List[TestNewResponse]


# ===== HELPER =====

def row_to_schema(t: TestNew) -> dict:
    return {
        "id": t.id,
        "q": t.question,
        "opts": [t.option_a, t.option_b, t.option_c, t.option_d],
        "correct": t.correct_index,
        "explanation": t.explanation or "",
        "difficulty": t.difficulty or "Oson",
        "points": t.points or 10,
    }


# ===== ENDPOINTS =====

@router.get("/questions")
def get_baraban_questions(
    count: int = 8,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(TestNew).filter(TestNew.is_active == True)
        if difficulty:
            query = query.filter(TestNew.difficulty == difficulty)

        all_tests = query.all()

        if not all_tests:
            raise HTTPException(
                status_code=404,
                detail="Testnew jadvalida savollar topilmadi. /api/baraban/seed endpointi orqali namunalar qoshing."
            )

        selected = random.sample(all_tests, min(count, len(all_tests)))

        return {
            "total": len(all_tests),
            "questions": [row_to_schema(t) for t in selected],
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"questions xato: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/questions/add")
def add_question(payload: TestNewCreate, db: Session = Depends(get_db)):
    try:
        if payload.correct_index not in (0, 1, 2, 3):
            raise HTTPException(status_code=422, detail="correct_index faqat 0, 1, 2 yoki 3 bolishi kerak")

        new_test = TestNew(
            question=payload.question,
            option_a=payload.option_a,
            option_b=payload.option_b,
            option_c=payload.option_c,
            option_d=payload.option_d,
            correct_index=payload.correct_index,
            explanation=payload.explanation or "",
            difficulty=payload.difficulty or "Oson",
            points=payload.points or 10,
            is_active=True,
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        print(f"Yangi savol qoshildi: id={new_test.id} | {new_test.question[:60]}")
        return row_to_schema(new_test)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"questions/add xato: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/questions/all")
def get_all_questions(db: Session = Depends(get_db)):
    all_tests = db.query(TestNew).order_by(TestNew.id).all()
    return {
        "total": len(all_tests),
        "questions": [row_to_schema(t) for t in all_tests],
    }


@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    test = db.query(TestNew).filter(TestNew.id == question_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Savol topilmadi")
    db.delete(test)
    db.commit()
    return {"success": True, "message": f"Savol #{question_id} ochirildi"}


@router.post("/seed")
def seed_sample_questions(db: Session = Depends(get_db)):
    existing = db.query(TestNew).count()
    if existing > 0:
        return {
            "message": f"Jadvalda allaqachon {existing} ta savol bor. Seed bekor qilindi.",
            "seeded": False,
        }

    sample_questions = [
        TestNew(question="O'zbekistonning poytaxti qaysi shahar?",
                option_a="Toshkent", option_b="Samarqand", option_c="Buxoro", option_d="Namangan",
                correct_index=0, explanation="Toshkent - O'zbekistonning poytaxti", difficulty="Oson", points=10),
        TestNew(question="2 + 2 = ?",
                option_a="3", option_b="5", option_c="4", option_d="6",
                correct_index=2, explanation="2 + 2 = 4", difficulty="Oson", points=10),
        TestNew(question="Quyosh sistemasida nechta sayyora bor?",
                option_a="7", option_b="8", option_c="9", option_d="10",
                correct_index=1, explanation="8 ta sayyora: Merkuriy, Venera, Yer, Mars, Yupiter, Saturn, Uran, Neptun",
                difficulty="O'rta", points=15),
        TestNew(question="Eng katta okean qaysi?",
                option_a="Atlantika", option_b="Hind", option_c="Arktika", option_d="Tinch",
                correct_index=3, explanation="Tinch okean eng katta okeandir", difficulty="Oson", points=10),
        TestNew(question="Prezident Shavkat Mirziyoyev necha yildan davlat boshlighi?",
                option_a="2014", option_b="2016", option_c="2018", option_d="2020",
                correct_index=1, explanation="2016 yildan boshlab prezident", difficulty="O'rta", points=15),
        TestNew(question="DNK asosan hujayrada qayerda joylashgan?",
                option_a="Mitoxondriya", option_b="Ribosom", option_c="Yadro", option_d="Xloroplast",
                correct_index=2, explanation="DNK asosan hujayraning yadrosida saqlanadi", difficulty="O'rta", points=15),
        TestNew(question="Pi (?) soni qanday qiymatga teng (taxminiy)?",
                option_a="2.14", option_b="3.14", option_c="4.14", option_d="1.41",
                correct_index=1, explanation="Pi  3.14159...", difficulty="O'rta", points=15),
        TestNew(question="Qaysi sayyora Quyoshga eng yaqin?",
                option_a="Venera", option_b="Yer", option_c="Mars", option_d="Merkuriy",
                correct_index=3, explanation="Merkuriy Quyoshga eng yaqin sayyora", difficulty="O'rta", points=15),
        TestNew(question="O'zbekistonda nechta viloyat mavjud?",
                option_a="10", option_b="11", option_c="12", option_d="14",
                correct_index=2, explanation="O'zbekistonda 12 ta viloyat va Toshkent shahri bor", difficulty="Oson", points=10),
        TestNew(question="Eng uzun daryo qaysi?",
                option_a="Amazonka", option_b="Nil", option_c="Yantszi", option_d="Mississippi",
                correct_index=1, explanation="Nil daryo dunyodagi eng uzun daryodir", difficulty="Oson", points=10),
        TestNew(question="Suvning kimyoviy formulasi nima?",
                option_a="CO2", option_b="NaCl", option_c="O2", option_d="H2O",
                correct_index=3, explanation="Suv H2O - ikki vodorod va bir kislorod atomidan iborat", difficulty="Oson", points=10),
        TestNew(question="1 km necha metrga teng?",
                option_a="100", option_b="500", option_c="1000", option_d="10000",
                correct_index=2, explanation="1 kilometr = 1000 metr", difficulty="Oson", points=10),
        TestNew(question="Yer Quyosh atrofida bir marta aylanib chiqishga necha kun ketadi?",
                option_a="30", option_b="180", option_c="365", option_d="400",
                correct_index=2, explanation="Yer bir yilda (365 kun) Quyosh atrofini aylanib chiqadi", difficulty="O'rta", points=15),
        TestNew(question="Insonning normal tana harorati necha daraja?",
                option_a="35", option_b="36.6", option_c="38", option_d="40",
                correct_index=1, explanation="Normal tana harorati 36.6 daraja Selsiy", difficulty="Oson", points=10),
        TestNew(question="Oltin qaysi kimyoviy belgi bilan ifodalanadi?",
                option_a="Ag", option_b="Fe", option_c="Au", option_d="Cu",
                correct_index=2, explanation="Oltin - Au (Aurum - lotincha)", difficulty="Qiyin", points=20),
        TestNew(question="Samarqand shahri nechinchi asrda qurilgan?",
                option_a="1-asr", option_b="3-asr", option_c="5-asr mil.avv.", option_d="7-asr",
                correct_index=2, explanation="Samarqand mil. avv. V asrda, ya'ni 2700 yil oldin tashkil topgan",
                difficulty="Qiyin", points=20),
        TestNew(question="Atom eng kichik qaysi zarrachadan iborat?",
                option_a="Molekula", option_b="Elektron, Proton, Neytron", option_c="Ion", option_d="Kristall",
                correct_index=1, explanation="Atom elektron, proton va neytrondan iborat", difficulty="O'rta", points=15),
        TestNew(question="Insonning nechta tishi bor (kattalar)?",
                option_a="28", option_b="30", option_c="32", option_d="36",
                correct_index=2, explanation="Kattalar 32 ta tishga ega (aql tishi bilan)", difficulty="O'rta", points=15),
    ]

    db.add_all(sample_questions)
    db.commit()

    return {
        "message": f"{len(sample_questions)} ta namuna savol muvaffaqiyatli qoshildi!",
        "seeded": True,
        "count": len(sample_questions),
    }
