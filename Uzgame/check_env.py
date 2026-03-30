import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / '.env'
print(f"Loading .env from: {env_path}")
print(f"File exists: {env_path.exists()}")

load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
USE_SQLITE = os.getenv("USE_SQLITE")

print(f"USE_SQLITE: {USE_SQLITE}")
print(f"DATABASE_URL: {DATABASE_URL}")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set!")
else:
    if "sqlite" in DATABASE_URL.lower():
        print("USING: SQLite")
    elif "postgresql" in DATABASE_URL.lower():
        print("USING: PostgreSQL")
    else:
        print(f"UNKNOWN DATABASE TYPE: {DATABASE_URL}")
