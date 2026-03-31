import requests
import json
import time

time.sleep(1)  # Wait a moment

# Test login with demo user
response = requests.post(
    'http://localhost:8000/auth/login',
    json={'email': 'demo@example.com', 'password': 'demo123'},
    timeout=5
)

print(f'Status: {response.status_code}')
print(f'Response: {json.dumps(response.json(), indent=2)}')

if response.status_code == 200:
    token = response.json().get('access_token')
    print(f'\n✓ Token obtained: {token[:40]}...')
else:
    print(f'\n✗ Login failed')
