import os
from datetime import datetime, timedelta
from typing import Any, Optional, Tuple

from passlib.context import CryptContext
from jose import jwt
from cryptography.fernet import Fernet
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-please")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Encryption key for cards
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "Io9FOTQs6rnk9sO-_Hra4DkdznVfQTWU7cLVJMMAOBM=").encode()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ============ CARD ENCRYPTION ============

def get_cipher():
    """Fernet cipher'ini ol"""
    return Fernet(ENCRYPTION_KEY)


def encrypt_card_number(card_number: str) -> str:
    """Karta raqamini shifrash"""
    cipher = get_cipher()
    encrypted = cipher.encrypt(card_number.encode()).decode()
    return encrypted


def decrypt_card_number(encrypted: str) -> str:
    """Shifrashtirilgan karta raqamini ochish (ADMIN ONLY)"""
    try:
        cipher = get_cipher()
        decrypted = cipher.decrypt(encrypted.encode()).decode()
        return decrypted
    except Exception as e:
        raise ValueError(f"Karta raqami tahlili xatosi: {e}")


def mask_card_number(card_number: str) -> str:
    """Karta raqamini ko'rsatishda yashirish - faqat oxirgi 4 raqam"""
    if len(card_number) < 4:
        return "****"
    return "*" * (len(card_number) - 4) + card_number[-4:]


def hash_card_token(card_number: str, expiry: str, cvv: str) -> str:
    """Karta tokenini yaratish (duplicate to'lovlarni oldini olish)"""
    token_str = f"{card_number}{expiry}{cvv}"
    return hashlib.sha256(token_str.encode()).hexdigest()


# ============ CARD VALIDATION ============

def validate_card_number(card_number: str) -> bool:
    """Luhn algoritmi bilan karta raqamini tekshirish"""
    card_number = card_number.replace(" ", "")
    
    if not card_number.isdigit() or len(card_number) < 13:
        return False
    
    # Luhn algorithm
    digits = [int(d) for d in card_number]
    checksum = 0
    
    for i, digit in enumerate(reversed(digits)):
        if i % 2 == 1:
            digit *= 2
            if digit > 9:
                digit -= 9
        checksum += digit
    
    return checksum % 10 == 0


def validate_expiry_date(expiry: str) -> bool:
    """Karta muddatini tekshirish (MM/YY formatida)"""
    if "/" not in expiry or len(expiry) != 5:
        return False
    
    try:
        month, year = expiry.split("/")
        month = int(month)
        year = int(year)
        
        if month < 1 or month > 12:
            return False
        
        # YY ni 20YY ga aylantirish
        current_year = datetime.now().year % 100
        full_year = 2000 + year
        
        # Muddati tugagan yoki tugamagan?
        return full_year > datetime.now().year or (full_year == datetime.now().year and month >= datetime.now().month)
    except:
        return False


def validate_cvv(cvv: str) -> bool:
    """CVV tekshirish (3-4 raqam)"""
    return cvv.isdigit() and len(cvv) in [3, 4]


def validate_card_holder(name: str) -> bool:
    """Karta egasi ismini tekshirish"""
    if not name or len(name) < 2 or len(name) > 100:
        return False
    
    valid_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789'-")
    return all(c in valid_chars for c in name)


def validate_card_all(card_number: str, expiry: str, cvv: str, card_holder: str) -> Tuple[bool, str]:
    """
    Barcha karta ma'lumotlarini tekshirish
    Return: (valid, error_message)
    """
    if not validate_card_number(card_number):
        return False, "Karta raqami noto'g'ri"
    
    if not validate_expiry_date(expiry):
        return False, "Karta muddati noto'g'ri yoki tugagan"
    
    if not validate_cvv(cvv):
        return False, "CVV noto'g'ri"
    
    if not validate_card_holder(card_holder):
        return False, "Karta egasi ismi noto'g'ri"
    
    return True, ""
