#!/usr/bin/env python3
"""
Database jadvallarini qayta yaratish skripti
game_questions jadvalida game_id ustunini qo'shish uchun
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import Base, DATABASE_URL
from app.models.game import GameQuestion, GameProgress, TeamGameProgress
from app.models.user import User

def drop_all_tables():
    """Barcha jadvallarni o'chirish"""
    engine = create_engine(DATABASE_URL)
    try:
        print("📊 Barcha jadvallar o'chirilmoqda...")
        Base.metadata.drop_all(engine)
        print("✅ Jadvallar o'chirildi")
        return engine
    except Exception as e:
        print(f"❌ Xato: {e}")
        return None

def create_all_tables(engine):
    """Yangi jadvallarni yaratish"""
    try:
        print("📝 Yangi jadvallar yaratilmoqda...")
        Base.metadata.create_all(engine)
        print("✅ Jadvallar yaratildi")
        return True
    except Exception as e:
        print(f"❌ Xato: {e}")
        return False

def add_sample_data(engine):
    """Namuna ma'lumotlarni qo'shish"""
    try:
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("📚 Namuna savollari qo'shilmoqda...")
        
        # Physics questions
        physics_questions = [
            GameQuestion(
                game_id="soz_qidiruv",
                stage_id=1,
                question_text="F = ma bo'yicha, agar m=5kg, a=2m/s² bo'lsa F nima?",
                options=["5 N", "10 N", "7 N", "15 N"],
                correct_answer=1,
                difficulty="Oson",
                explanation="Nyuton qonuni: kuch = massa × tezlanish",
                order_index=1,
                points=1
            ),
            GameQuestion(
                game_id="soz_qidiruv",
                stage_id=1,
                question_text="Tezlik formulasi qaysi?",
                options=["v = s/t", "v = a/t", "v = m/t", "v = F/t"],
                correct_answer=0,
                difficulty="Oson",
                explanation="Tezlik - vaqt birligida o'tilgan masofa",
                order_index=2,
                points=1
            ),
            GameQuestion(
                game_id="soz_qidiruv",
                stage_id=1,
                question_text="Energiya ni SI birligida nima deyiladi?",
                options=["Kilojoule", "Joul", "Vatt", "Kat"],
                correct_answer=1,
                difficulty="Oson",
                explanation="Energiya birligi - Joul (J)",
                order_index=3,
                points=1
            ),
            GameQuestion(
                game_id="soz_qidiruv",
                stage_id=1,
                question_text="Og'irlik tezlanuvi g ni qiymatini toping",
                options=["5.8 m/s²", "9.8 m/s²", "12.3 m/s²", "7.5 m/s²"],
                correct_answer=1,
                difficulty="O'rta",
                explanation="Yer yuzasida og'irlik tezlanuvi taxminan 9.8 m/s²",
                order_index=4,
                points=1
            ),
            GameQuestion(
                game_id="soz_qidiruv",
                stage_id=1,
                question_text="Moddaning og'irligi P = ?",
                options=["P = m/g", "P = m × g", "P = g/m", "P = m + g"],
                correct_answer=1,
                difficulty="O'rta",
                explanation="Og'irlik = massa × og'irlik tezlanuvi",
                order_index=5,
                points=1
            ),
        ]
        
        session.add_all(physics_questions)
        session.commit()
        
        print(f"✅ {len(physics_questions)} ta savol qo'shildi")
        session.close()
        return True
        
    except Exception as e:
        print(f"❌ Xato: {e}")
        return False

def main():
    print("=" * 60)
    print("🔧 DATABASE RECONSTRUCTION SCRIPT")
    print("=" * 60)
    
    # Database URL tekshirish
    if not DATABASE_URL:
        print("❌ DATABASE_URL aniqlanmadi!")
        sys.exit(1)
    
    print(f"📍 Database: {DATABASE_URL}\n")
    
    # 1. Jadvallarni o'chirish
    engine = drop_all_tables()
    if not engine:
        sys.exit(1)
    
    # 2. Yangi jadvallarni yaratish
    if not create_all_tables(engine):
        sys.exit(1)
    
    # 3. Namuna ma'lumotlarni qo'shish
    if not add_sample_data(engine):
        print("⚠️  Namuna ma'lumotlar qo'shishda xato, lekin jadvallar yaratildi")
    
    print("\n" + "=" * 60)
    print("✅ DATABASE QAYTA TUZILDI")
    print("=" * 60)
    print("\nKeyingi qadamlar:")
    print("1. Ilovani restart qiling: Ctrl+C va qayta 'python main.py'")
    print("2. GET /games/questions/soz_qidiruv?difficulty=Oson promasini tekshiring")
    print("=" * 60)

if __name__ == "__main__":
    main()
