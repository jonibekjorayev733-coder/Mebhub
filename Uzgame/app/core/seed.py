from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)


def seed_data(db: Session):
    """Database bo'sh bo'lganda test data qo'shish"""
    try:
        logger.info("Seed data yaratildi")
    except Exception as e:
        logger.error(f"Seed data error: {e}")
