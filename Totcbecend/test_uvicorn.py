#!/usr/bin/env python
"""Test simple ASGI app with uvicorn"""
import sys
sys.path.insert(0, '.')

print("1. Creating simple ASGI app...")

async def simple_app(scope, receive, send):
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [[b'content-type', b'application/json']],
    })
    await send({
        'type': 'http.response.body',
        'body': b'{"ok": true}',
    })

print("2. Importing uvicorn...")
import uvicorn

print("3. Starting uvicorn on port 8000...")
print("Server running at http://127.0.0.1:8000")
print("Press Ctrl+C to stop\n")

try:
    uvicorn.run(simple_app, host='127.0.0.1', port=8000, log_level='warning', access_log=False)
except KeyboardInterrupt:
    print("\nServer stopped")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
