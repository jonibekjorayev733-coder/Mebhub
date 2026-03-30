import requests
import json

# Test login API - CORRECT ENDPOINT
response = requests.post(
    'http://127.0.0.1:8000/auth/login',
    json={'email': 'admin@example.com', 'password': 'admin123'}
)

print("Status Code:", response.status_code)
print("Response:", json.dumps(response.json(), indent=2))

if response.status_code == 200:
    data = response.json()
    if 'user' in data:
        print("\nUser is_admin:", data['user'].get('is_admin'))
