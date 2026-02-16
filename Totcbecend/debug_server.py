#!/usr/bin/env python
"""Debug server to see why it's shutting down"""
import sys
import os
import asyncio

print("=" * 70)
print("DEBUG: Starting backend server...")
print("=" * 70)

print(f"Python: {sys.version}")
print(f"CWD: {os.getcwd()}")
print(f"Files in CWD: {os.listdir('.')[:5]}")

print("\n[1] Testing imports...")
try:
    from app.main import app
    print("[OK] app.main imported")
except Exception as e:
    print(f"[ERROR] Failed to import app.main: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n[2] Checking routes...")
print(f"   Total routes: {len(app.routes)}")
for i, route in enumerate(app.routes[:5]):
    print(f"   {i+1}. {route.path}")

print("\n[3] Starting uvicorn server...")
import uvicorn

config = uvicorn.Config(
    app,
    host="127.0.0.1",
    port=8000,
    log_level="info",
    access_log=True,
)

print(f"   Config: {config.host}:{config.port}")

try:
    server = uvicorn.Server(config)
    print("[OK] Server created")
    print("[INFO] Starting server loop...\n")
    
    # This should block forever
    asyncio.run(server.serve())
    
except KeyboardInterrupt:
    print("\n[OK] Server stopped (Ctrl+C)")
except Exception as e:
    print(f"\n[ERROR] Server error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 70)
print("Server process ended")
print("=" * 70)
