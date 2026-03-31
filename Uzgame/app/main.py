from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db, Base, sessionLocal
from app.database_users import users_engine, UsersBase, init_users_db
from app.models.base import User as UserModel, Med, Game as GameModel, TestSet, Question, Option, Score, MultiplayerRoom, AdminRole
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from app.schemas.userschemas import UserCreate, User as UserSchema, Token
from app.auth.auth import authenticate_user, create_access_token, get_password_hash, get_current_user, \
    ACCESS_TOKEN_EXPIRE_MINUTES
from app.routers import auth, user_accounts, emailuser_router, learning, admin, certificate
from datetime import timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from app.core.seed import seed_data
except:
    def seed_data(db):
        pass

# Create tables and seed data synchronously on startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✓ Med database tables verified/created")
    with sessionLocal() as db:
        med_count = db.query(Med).count()
        logger.info(f"✓ Med table: {med_count} users")
        # Check medical tables
        topics_count = db.query(MedicalTopic).count()
        items_count = db.query(LearningItem).count()
        questions_count = db.query(TestQuestion).count()
        logger.info(f"✓ Medical tables: {topics_count} topics, {items_count} items, {questions_count} questions")
        # Check admin roles
        admin_roles_count = db.query(AdminRole).count()
        logger.info(f"✓ Admin roles table: {admin_roles_count} admin roles")
except Exception as e:
    logger.error(f"Startup error (med database): {e}")

# Initialize users database
try:
    init_users_db()
    from app.database_users import UsersSessionLocal
    with UsersSessionLocal() as db:
        from app.models.user_accounts import UserAccount
        users_count = db.query(UserAccount).count()
        logger.info(f"✓ Users database: {users_count} users")
except Exception as e:
    logger.error(f"Startup error (users database): {e}")

app = FastAPI(title="Uzgame API - Medical Education")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user_accounts.router)
app.include_router(emailuser_router.router)
app.include_router(learning.router)
app.include_router(admin.router)
app.include_router(certificate.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0", "api": "Uzgame Medical Education API"}
