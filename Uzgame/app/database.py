import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

# Configure logging IMMEDIATELY
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("=" * 60)
logger.info("[DATABASE.PY] INITIALIZING DATABASE")
logger.info("=" * 60)

# FIXED: Load .env from project root, not Uzgame folder
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
logger.info(f"[DATABASE] Loading .env from: {env_path}")
logger.info(f"[DATABASE] .env exists: {env_path.exists()}")

load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
logger.info(f"[DATABASE] DATABASE_URL loaded: {DATABASE_URL}")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file")

logger.info(f"[DATABASE] Creating engine for: {DATABASE_URL}")

if DATABASE_URL.startswith("sqlite"):
    logger.info("[DATABASE] Using SQLite engine")
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    logger.info("[DATABASE] Using PostgreSQL engine")
    engine = create_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=10,
        pool_timeout=30,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

logger.info(f"[DATABASE] Engine dialect: {engine.dialect.name}")
logger.info(f"[DATABASE] Engine URL: {engine.url}")

sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()
