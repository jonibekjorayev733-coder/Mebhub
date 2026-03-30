from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
pg_engine = create_engine(POSTGRESQL_URL, echo=False)

PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)
session = PgSessionLocal()

print("TEST: Direct insert (simulating register endpoint)...")

from app.models.base import Med
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    # Insert Med
    med = Med(
        email="trace.test@example.com",
        hashed_password=pwd.hash("pass123"),
        full_name="Trace Test",
        provider="email",
        is_active=True
    )
    session.add(med)
    session.commit()
    print(f"OK: Med table insert committed, ID={med.id}")
    
    # Check if actually in database NOW
    check = session.execute(text("SELECT COUNT(*) FROM med WHERE email = 'trace.test@example.com'")).scalar()
    print(f"OK: Med table COUNT check: {check} rows")
    
    if check > 0:
        print("SUCCESS: Data persisted to database!")
    else:
        print("FAIL: Data NOT in database even after commit!")
        
except Exception as e:
    print(f"ERROR: {e}")
    session.rollback()
finally:
    session.close()

