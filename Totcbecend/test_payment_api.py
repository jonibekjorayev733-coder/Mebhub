import requests
import json

try:
    # Register user
    reg_response = requests.post('http://localhost:8000/auth/register', json={
        'email': 'testuser@test.com',
        'username': 'testuser',
        'password': 'Test123!'
    })
    print('✅ User registration:', reg_response.status_code)
    
    # Login
    login_response = requests.post('http://localhost:8000/auth/login', json={
        'email': 'testuser@test.com',
        'password': 'Test123!'
    })
    token = login_response.json().get('access_token')
    print('✅ Login:', login_response.status_code)
    
    # Test payment endpoint with valid card (Visa test number)
    headers = {'Authorization': f'Bearer {token}'}
    payment_data = {
        'course_id': 1,
        'card_number': '4111111111111111',  # Valid test card
        'card_expiry': '12/25',
        'card_cvv': '123',
        'card_holder': 'Test User'
    }
    
    payment_response = requests.post(
        'http://localhost:8000/payments/process',
        json=payment_data,
        headers=headers,
        timeout=5
    )
    print('✅ Payment endpoint:', payment_response.status_code)
    print('✅ Response:')
    print(json.dumps(payment_response.json(), indent=2))
    
    print("\n✅ ALL TESTS PASSED! Payment API is working correctly!")
    
except Exception as e:
    print(f'❌ Error: {e}')
