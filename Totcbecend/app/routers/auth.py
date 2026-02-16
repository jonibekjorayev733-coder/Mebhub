from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from ..config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from ..database import get_db
from ..models import User
from ..schemas import TokenResponse, UserCreate, UserRead, LoginRequest
from ..security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


from fastapi import Request, Response

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = None
    
    # Check Authorization header first (Priority)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        print("DEBUG: Using Bearer token from Header")
    
    # Fallback to Cookie
    if not token:
        token = request.cookies.get("access_token")
        if token:
            print(f"DEBUG: Using token from Cookie")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        print("DEBUG: No token found")
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            print("DEBUG: No username in token")
            raise credentials_exception
    except JWTError as e:
        print(f"DEBUG: JWT Error: {e}")
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if not user:
        print("DEBUG: User not found in DB")
        raise credentials_exception
    return user


@router.post("/signup", response_model=UserRead, status_code=201)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(User)
        .filter((User.username == payload.username) | (User.email == payload.email))
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Username yoki email band")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(response: Response, payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.username == payload.username) | (User.email == payload.username)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Username yoki parol xato")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/", # Explicit path
        samesite="lax",
        secure=False # Set to True in production with HTTPS
    )
    
    # Return token in response body too (for client-side storage)
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "user_id": user.id,
        "role": user.role
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user

