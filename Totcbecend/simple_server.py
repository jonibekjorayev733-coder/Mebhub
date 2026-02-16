#!/usr/bin/env python
"""Simple wrapper using subprocess.Popen to keep server running"""
import subprocess
import sys
import os
import time

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("*" * 70)
print("* BACKEND SERVER - PAYMENT SYSTEM")
print("*" * 70)
print("* URL: http://127.0.0.1:8000")
print("* Docs: http://127.0.0.1:8000/docs")
print("*" * 70)

# Run uvicorn using Popen which doesn't have signal issues
process = subprocess.Popen([
    sys.executable,
    "-m", "uvicorn",
    "app.main:app",
    "--host", "127.0.0.1",
    "--port", "8000",
    "--no-server-header"
])

print("\nServer started with PID:", process.pid)
print("Press Ctrl+C to stop\n")

try:
    process.wait()
except KeyboardInterrupt:
    print("\n\nShutting down...")
    process.terminate()
    process.wait(timeout=5)
    print("Server stopped")
except Exception as e:
    print(f"Error: {e}")
    process.kill()
