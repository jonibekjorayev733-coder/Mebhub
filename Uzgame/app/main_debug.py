import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from app.routers import auth, games, test_sets, questions, scores, users_router
import logging

# Setup logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

logger.info("=" * 50)
logger.info("STARTING BACKEND WITH POSTGRES")
logger.info("=" * 50)

app = FastAPI(title="Medical Learning App", version="1.0.0")

# Register routers
app.include_router(auth.router)
app.include_router(games.router)
app.include_router(test_sets.router)
app.include_router(questions.router)
app.include_router(scores.router)
app.include_router(users_router.router)

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Medical Learning App API"}

@app.get("/health")
async def health():
    logger.info("Health check")
    return {"status": "ok"}

if __name__ == "__main__":
    logger.info("Running uvicorn server...")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
