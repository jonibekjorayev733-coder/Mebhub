import requests
import json

# Get a valid token first by logging in
login_response = requests.post(
    'http://127.0.0.1:8000/auth/login',
    json={'email': 'test@example.com', 'password': 'test123'}
)

print(f"Login status: {login_response.status_code}")

if login_response.status_code == 200:
    token = login_response.json()['access_token']
    print(f"Token: {token[:20]}...")
    
    # Now test PUT /auth/profile
    profile_response = requests.put(
        'http://127.0.0.1:8000/auth/profile',
        headers={'Authorization': f'Bearer {token}'},
        json={'full_name': 'Test User Updated', 'profile_picture': None}
    )
    
    print(f"Profile update status: {profile_response.status_code}")
    print(f"Response: {profile_response.text}")
else:
    print(f"Login failed: {login_response.text}")
