from sqlalchemy import create_engine
from app.database import Base
from app.models.base import Med, User, Game, TestSet, Question, Option, Score, MultiplayerRoom
from app.models.emailuser_model import EmailUser
from app.models.user_accounts import UserAccount

# PostgreSQL connection
POSTGRESQL_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
pg_engine = create_engine(POSTGRESQL_URL)

print("=" * 70)
print("POSTGRES TABLES YARATILMOQDA...")
print("=" * 70)

try:
    # Create all tables
    Base.metadata.create_all(bind=pg_engine)
    
    print("\n✓ Tables muvaffaqiyatli yaratildi:")
    print("  - med")
    print("  - users")
    print("  - games")
    print("  - test_sets")
    print("  - questions")
    print("  - options")
    print("  - scores")
    print("  - multiplayer_rooms")
    print("  - emailuser")
    print("  - user_accounts")
    
    print("\n" + "=" * 70)
    print("TAYYORMISIZ!")
    print("=" * 70)
    
except Exception as e:
    print(f"❌ Xato: {e}")
