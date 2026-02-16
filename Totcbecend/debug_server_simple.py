import sys
import uvicorn
import traceback
import os

# Redirect stdout and stderr to a file
log_file = open("startup_log.txt", "w", encoding="utf-8")
sys.stdout = log_file
sys.stderr = log_file

print("--- STARTING DEBUG SCRIPT ---")
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    print(f"Current directory: {current_dir}")

    print("Importing app.main...")
    from app.main import app
    print("App imported successfully.")
    
    print("Starting server on 8000...")
    config = uvicorn.Config(app, host="127.0.0.1", port=8000, log_level="debug", reload=False)
    server = uvicorn.Server(config)
    server.run()
except Exception:
    print("\n❌ CRITICAL ERROR:")
    traceback.print_exc()
finally:
    print("--- END DEBUG SCRIPT ---")
    log_file.close()
