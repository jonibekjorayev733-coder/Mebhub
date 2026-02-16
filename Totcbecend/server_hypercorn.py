#!/usr/bin/env python
"""Backend server using Hypercorn instead of Uvicorn"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 BACKEND SERVER - KEEP TERMINAL OPEN!")
    print("="*70)
    print("📍 Server URL: http://127.0.0.1:8000")
    print("📊 API Docs: http://127.0.0.1:8000/docs")
    print("=" * 70)
    print("✅ Starting...\n")
    
    try:
        from hypercorn.asyncio import serve
        from hypercorn.config import Config
        import asyncio
        from app.main import app
        
        config = Config()
        config.bind = ["127.0.0.1:8000"]
        config.access_log_format = ""
        
        print("Running on http://127.0.0.1:8000")
        print()
        
        asyncio.run(serve(app, config))
        
    except KeyboardInterrupt:
        print("\n\n⚠️ Keyboard interrupt received")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
