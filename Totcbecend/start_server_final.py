#!/usr/bin/env python
"""Start backend server"""
import subprocess
import sys
import time

print("\n" + "="*70)
print("🚀 BACKEND SERVER STARTING")
print("="*70)
print("📍 http://127.0.0.1:8000")
print("📊 Docs: http://127.0.0.1:8000/docs")
print("="*70)

# Start uvicorn in subprocess
proc = subprocess.Popen([
    sys.executable, "-m", "uvicorn",
    "app.main:app",
    "--host", "127.0.0.1",
    "--port", "8000"
])

print("\n✅ Server starting (keep terminal open!)\n")

try:
    proc.wait()
except KeyboardInterrupt:
    print("\n\n⚠️ Stopping server...")
    proc.terminate()
    proc.wait()
    print("✅ Server stopped")
