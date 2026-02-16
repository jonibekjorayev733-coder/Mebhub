import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# .env dan o'qish uchun: pip install python-dotenv
from dotenv import load_dotenv
load_dotenv()

# PostgreSQL connection
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
