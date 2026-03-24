from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.database import Base


class GameTestBank(Base):
    __tablename__ = "game_test_bank"

    id = Column(Integer, primary_key=True, index=True)
    game_key = Column(String(100), index=True, nullable=False)
    question = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_index = Column(Integer, nullable=False)
    explanation = Column(Text, default="")
    difficulty = Column(String(50), default="Oson")
    points = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_question_payload(self):
        return {
            "id": self.id,
            "q": self.question,
            "opts": [self.option_a, self.option_b, self.option_c, self.option_d],
            "correct": self.correct_index,
            "difficulty": self.difficulty,
            "explanation": self.explanation or "",
            "points": self.points,
        }
