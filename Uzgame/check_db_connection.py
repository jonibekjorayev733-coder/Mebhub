from app.database import engine
from sqlalchemy import text

conn = engine.connect()
result = conn.execute(text("SELECT datname FROM pg_database WHERE datname = 'med'"))
db = result.fetchone()
if db:
    print(f"Connected to database: {db[0]}")
else:
    print("Database 'med' NOT FOUND - connected to wrong database!")

# Check connection URL
print(f"Engine URL: {engine.url}")

conn.close()
