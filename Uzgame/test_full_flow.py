import requests
import json

# Test login
login_response = requests.post(
    'http://localhost:8000/auth/login',
    json={'email': 'demo@example.com', 'password': 'demo123'}
)

print(f'✓ Login Status: {login_response.status_code}')

if login_response.status_code == 200:
    token = login_response.json().get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    
    # Test admin/users
    users_response = requests.get('http://localhost:8000/admin/users', headers=headers)
    print(f'✓ /admin/users Status: {users_response.status_code}')
    if users_response.status_code == 200:
        users = users_response.json()
        print(f'  Found {len(users)} users')
    
    # Test admin/topics
    topics_response = requests.get('http://localhost:8000/admin/topics', headers=headers)
    print(f'✓ /admin/topics Status: {topics_response.status_code}')
    if topics_response.status_code == 200:
        topics = topics_response.json()
        print(f'  Found {len(topics)} topics')
    
    print('\n✅ All tests passed!')
else:
    print(f'✗ Login failed: {login_response.text}')
