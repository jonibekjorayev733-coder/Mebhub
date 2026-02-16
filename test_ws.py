import asyncio
import websockets
import json
import urllib.request

def test_http():
    url = "http://127.0.0.1:8002/ws-test"
    print(f"Attempting to fetch {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            print(f"HTTP Response: {response.read().decode('utf-8')}")
    except Exception as e:
        print(f"HTTP Request failed: {e}")

async def test_connection():
    uri = "ws://127.0.0.1:8002/ws/7"
    print(f"Attempting to connect to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected successfully!")
            await websocket.send(json.dumps({"type": "ping"}))
            response = await websocket.recv()
            print(f"Received: {response}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_http()
    asyncio.run(test_connection())
