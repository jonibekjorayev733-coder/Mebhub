from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class TestNew(Base):
    """
    Baraban o'yini uchun testlar jadvali.
    Har bir test savolidan iborat bo'lib, 4 ta variant va 1 ta to'g'ri javob mavjud.
    """
    __tablename__ = "testnew"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)         # Savol matni
    option_a = Column(String(500), nullable=False)  # 1-variant
    option_b = Column(String(500), nullable=False)  # 2-variant
    option_c = Column(String(500), nullable=False)  # 3-variant
    option_d = Column(String(500), nullable=False)  # 4-variant
    correct_index = Column(Integer, nullable=False)  # To'g'ri javob index: 0=A, 1=B, 2=C, 3=D
    explanation = Column(Text, default="")           # Izoh
    difficulty = Column(String(50), default="Oson")  # Qiyinlik darajasi: Oson, O'rta, Qiyin
    points = Column(Integer, default=10)             # Ball miqdori
    is_active = Column(Boolean, default=True)        # Aktiv/Noeaktiv
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "q": self.question,
            "opts": [self.option_a, self.option_b, self.option_c, self.option_d],
            "correct": self.correct_index,
            "explanation": self.explanation,
            "difficulty": self.difficulty,
            "points": self.points,
        }
