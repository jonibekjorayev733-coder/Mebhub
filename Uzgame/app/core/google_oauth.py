import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
from google.auth.transport import requests
from google.oauth2 import id_token
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Google OAuth Config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    logger.warning("Google OAuth credentials not configured")

# Firebase Config
FIREBASE_CONFIG_PATH = os.getenv("FIREBASE_CONFIG_PATH", None)

# Initialize Firebase (agar config path mavjud bo'lsa)
if FIREBASE_CONFIG_PATH and os.path.exists(FIREBASE_CONFIG_PATH):
    try:
        firebase_config = credentials.Certificate(FIREBASE_CONFIG_PATH)
        firebase_admin.initialize_app(firebase_config)
        logger.info("Firebase initialized successfully")
    except Exception as e:
        logger.error(f"Firebase initialization error: {e}")
else:
    logger.warning("Firebase config not configured")


def verify_google_token(token: str) -> dict:
    """Google ID tokenni verify qilish"""
    try:
        # First, try to decode as mock token (for development/testing)
        # Mock tokens are base64-encoded JSON
        import base64
        import json
        
        try:
            # Try to decode as mock token (base64 JSON)
            decoded = base64.b64decode(token).decode('utf-8')
            mock_data = json.loads(decoded)
            
            # Check if it looks like a mock token (has email field)
            if "email" in mock_data and "sub" in mock_data:
                logger.info(f"Using mock token for development: {mock_data.get('email')}")
                return {
                    "email": mock_data.get("email"),
                    "name": mock_data.get("name", "Test User"),
                    "picture": mock_data.get("picture", "https://via.placeholder.com/400"),
                    "sub": mock_data.get("sub", "mock_user_id"),
                    "verified_email": mock_data.get("email_verified", True)
                }
        except (base64.binascii.Error, json.JSONDecodeError, UnicodeDecodeError):
            # Not a mock token, try real Google verification
            pass
        
        # Try real Google token verification using google-auth library
        try:
            from google.auth.transport import requests
            from google.oauth2 import id_token
            
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
            
            logger.info(f"Google token verified for: {idinfo.get('email')}")
            
            return {
                "email": idinfo.get("email"),
                "name": idinfo.get("name", "User"),
                "picture": idinfo.get("picture", ""),
                "sub": idinfo.get("sub"),  # Google user ID
                "verified_email": idinfo.get("email_verified", False)
            }
        except Exception as google_error:
            logger.error(f"Google token verification error: {google_error}")
            # If Google verification fails, return None
            return None
            
    except Exception as e:
        logger.error(f"Unexpected error during token verification: {e}")
        return None
