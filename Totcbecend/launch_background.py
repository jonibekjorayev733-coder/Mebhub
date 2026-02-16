#!/usr/bin/env python
"""
Persistent Backend Server Launcher
Keeps running even when parent terminal closes
"""
import subprocess
import sys
import time
import os
import signal

def run_persistent():
    """Run backend in persistent subprocess"""
    print("\n" + "="*70)
    print("🚀 BACKEND SERVER LAUNCHER")
    print("="*70)
    print("📍 http://127.0.0.1:8000")
    print("="*70)
    print("⏳ Starting subprocess...\n")
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start uvicorn as subprocess
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
        "--log-level",
        "info",
    ]
    
    # Use creationflags to detach process on Windows
    creationflags = 0
    if sys.platform == "win32":
        import subprocess as sp
        creationflags = sp.CREATE_NEW_PROCESS_GROUP | sp.CREATE_NO_WINDOW
    
    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            creationflags=creationflags if sys.platform == "win32" else 0
        )
        
        print(f"✅ Process started (PID: {proc.pid})")
        print("\n🎉 Server is now running in background!")
        print("   Frontend: http://localhost:5173")
        print("   Backend:  http://127.0.0.1:8000")
        print("\n" + "="*70)
        
        # Keep launcher alive for 5 seconds, then exit
        # Subprocess will continue running
        time.sleep(5)
        print("\n✅ Launcher exiting (server continues in background)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        run_persistent()
    except KeyboardInterrupt:
        print("\n✅ Launcher stopped")
        sys.exit(0)
