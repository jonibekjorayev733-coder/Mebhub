from app.database import engine, DATABASE_URL
print(f"Loaded DATABASE_URL: {DATABASE_URL}")
print(f"Engine URL: {engine.url}")
print(f"Engine dialect: {engine.dialect.name}")
