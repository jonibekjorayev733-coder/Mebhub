import requests
import json

BASE_URL = "http://localhost:8000"

print("\n" + "=" * 70)
print("UZGAME BACKEND API TESTS - Login & Google OAuth")
print("=" * 70 + "\n")

# Test 1: Register yangi foydalanuvchi
print("TEST 1: Register yangi foydalanuvchi (Email + Password)")
print("-" * 70)

register_data = {
    "email": "john.doe@example.com",
    "password": "SecurePassword123",
    "full_name": "John Doe"
}

response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✓ Success: {response.json()['email']}")
else:
    print(f"✗ Error: {response.json()}")

# Test 2: Login with email and password
print("\n\nTEST 2: Login qilish (Email + Password)")
print("-" * 70)

login_data = {
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    token = response.json()["access_token"]
    user = response.json()["user"]
    print(f"✓ Success: {user['email']}")
    print(f"  Provider: {user['provider']}")
    print(f"  Token: {token[:50]}...")
    
    # Test 3: Get current user
    print("\n\nTEST 3: Hozirgi userni olish (Protected)")
    print("-" * 70)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        user_info = response.json()
        print(f"✓ Success: {user_info['email']}")
        print(f"  Full Name: {user_info['full_name']}")
        print(f"  Created: {user_info['created_at']}")
    else:
        print(f"✗ Error: {response.json()}")
        
else:
    print(f"✗ Error: {response.json()}")

# Test 4: Health check
print("\n\nTEST 4: Health Check")
print("-" * 70)

response = requests.get(f"{BASE_URL}/health")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    health = response.json()
    print(f"✓ Success: {health['status']}")
    print(f"  API: {health['api']}")
    print(f"  Version: {health['version']}")
else:
    print(f"✗ Error: {response.json()}")

print("\n" + "=" * 70)
print("GOOGLE LOGIN TEST (Placeholder - Frontend dan keladi)")
print("=" * 70)
print("""
GOOGLE LOGIN FLOW:
1. Frontend: Google Sign-In button bosiladi
2. Frontend: Google dan ID token olinadi
3. Frontend: POST /auth/google-login ga token jo'natiladi
4. Backend: Token verify qilinadi
5. Backend: User bazada yaratiladi yoki update qilinadi
6. Backend: JWT access token qaytariladi

Example request:
{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ..."
}

Response:
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
        "id": 2,
        "email": "user@gmail.com",
        "full_name": "Google User",
        "provider": "google",
        "google_id": "118234567890",
        "profile_picture": "https://..."
    }
}
""")

print("\n" + "=" * 70)
print("BARCHA TESTLAR TUGADI!")
print("=" * 70)

