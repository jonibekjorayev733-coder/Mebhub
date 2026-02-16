#!/usr/bin/env python
"""Simple server runner that keeps the process alive"""
import sys
import signal
import asyncio
import time

def signal_handler(sig, frame):
    print('\n✅ Server shutting down gracefully...')
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    import uvicorn
    from app.main import app
    
    print("🚀 Starting FastAPI server...")
    print("📍 URL: http://127.0.0.1:8000")
    print("📚 Docs: http://127.0.0.1:8000/docs")
    
    server = uvicorn.Server(
        uvicorn.Config(
            app,
            host="127.0.0.1",
            port=8000,
            log_level="info"
        )
    )
    
    try:
        asyncio.run(server.serve())
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
