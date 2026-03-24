from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db, Base
from app.models.user import User as UserModel
from app.models.rooster import RoosterQuestion
from app.models.testnew import TestNew  # testnew jadvali uchun
from app.models.game_test_bank import GameTestBank
from app.schemas.userschemas import UserCreate, User as UserSchema, Token
from app.auth.auth import authenticate_user, create_access_token, get_password_hash, get_current_user, \
    ACCESS_TOKEN_EXPIRE_MINUTES
from app.routers import games, multiplayer, team_games, rooster, game_tests, baraban, game_test_bank
from app.routers import test as test_router
from app.routers import sections as sections_router
from datetime import timedelta
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create tables only once at startup
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Critical: Could not create tables: {e}", exc_info=True)
    raise

# Create app
app = FastAPI()

# Add CORS middleware FIRST, before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include games router
app.include_router(games.router)
app.include_router(multiplayer.router)
app.include_router(team_games.router)
app.include_router(rooster.router)
app.include_router(test_router.router)
app.include_router(sections_router.router)
app.include_router(game_tests.router)
app.include_router(baraban.router)
app.include_router(game_test_bank.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Server is running"}

@app.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(user.password)
        db_user = UserModel(email=user.email, username=user.username, hashed_password=hashed_password, is_active=True)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.get("/debug/users")
def get_users(db: Session = Depends(get_db)):
    """Debug endpoint to list all users"""
    users = db.query(UserModel).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    logger.info(f"Token endpoint called with username: {form_data.username}")
    user = authenticate_user(db, form_data.username, form_data.password)
    logger.info(f"Authentication result: {user is not None}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserSchema)
def read_users_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user