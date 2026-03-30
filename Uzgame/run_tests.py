#!/usr/bin/env python
"""
Run tests with proper subprocess isolation
"""
import subprocess
import time
import sys
import os

# Change to Uzgame directory
os.chdir("c:\\react Jonibek\\vite-project\\Uzgame")

# Start server in separate process
print("Starting server...")
server_process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Wait for server to start
time.sleep(3)

try:
    # Run test
    print("\nRunning tests...")
    test_result = subprocess.run(
        [sys.executable, "test_auth_api.py"],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    print(test_result.stdout)
    if test_result.stderr:
        print("STDERR:", test_result.stderr)
    print(f"\nTest exit code: {test_result.returncode}")
    
finally:
    # Cleanup
    print("\nShutting down server...")
    server_process.terminate()
    try:
        server_process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        server_process.kill()
    print("Done!")
