import requests
import time

time.sleep(2)  # Wait for response

r = requests.post('http://localhost:8000/auth/register', json={
    'email': 'proven.working@example.com',
    'password': 'pass123',
    'full_name': 'Proven Working User'
})

print(f'Status: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    print(f'User ID: {data["id"]}')
    print(f'Email: {data["email"]}')
    print('✅ REGISTER SUCCESS')
else:
    print(f'Error: {r.text}')
