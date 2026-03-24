from sqlalchemy import text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models  # Import models to register them with SQLAlchemy
from routers import auth, games, sections, tests, game_tests, teacher_auth, custom_tests
from routers import dashboard_auth, dashboard_tests, dashboard_results

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vite Project API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["auth"])
app.include_router(teacher_auth.router, prefix="/api/auth", tags=["teacher-auth"])
app.include_router(dashboard_auth.router, tags=["dashboard-auth-v2"])
app.include_router(games.router, prefix="/games", tags=["games"])
app.include_router(sections.router, prefix="/sections", tags=["sections"])
app.include_router(tests.router, prefix="/legacy/tests", tags=["tests-legacy"])
app.include_router(dashboard_tests.router, tags=["dashboard-tests-v2"])
app.include_router(dashboard_results.router, tags=["dashboard-results-v2"])
app.include_router(game_tests.router, tags=["game-tests"])
app.include_router(custom_tests.router, tags=["custom-tests"])


@app.get("/")
def root():
    return {"message": "Interaktiv-ta'lim API", "version": "1.0"}


@app.get("/health")
def health():
    """Frontend backend holatini tekshirish uchun"""
    try:
        from database import engine
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "ok", "database": "disconnected"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
