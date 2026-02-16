#!/usr/bin/env python
"""Simple ASGI-to-HTTP gateway that works reliably on Windows"""
import os
import sys
import socket
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import signal

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

# Import the FastAPI app
from app.main import app
from starlette.testclient import TestClient

# Create a test client that works without needing async
client = TestClient(app)

class GatewayHandler(BaseHTTPRequestHandler):
    """HTTP handler that proxies to FastAPI via TestClient"""
    
    def _handle_request(self):
        try:
            # Parse the request
            parsed_path = urllib.parse.urlparse(self.path)
            path = parsed_path.path
            query = parsed_path.query or ""
            
            # Build the full URL
            if query:
                full_url = f"{path}?{query}"
            else:
                full_url = path
            
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = None
            if content_length > 0:
                body = self.rfile.read(content_length)
            
            # Forward to FastAPI
            method = self.command
            if method == 'GET':
                response = client.get(full_url)
            elif method == 'POST':
                response = client.post(full_url, content=body)
            elif method == 'PUT':
                response = client.put(full_url, content=body)
            elif method == 'DELETE':
                response = client.delete(full_url)
            elif method == 'PATCH':
                response = client.patch(full_url, content=body)
            elif method == 'HEAD':
                response = client.head(full_url)
            elif method == 'OPTIONS':
                response = client.options(full_url)
            else:
                self.send_error(405, "Method not allowed")
                return
            
            # Send response back to client
            self.send_response(response.status_code)
            
            # Copy headers
            for header_name, header_value in response.headers.items():
                if header_name.lower() not in ['content-encoding', 'transfer-encoding']:
                    self.send_header(header_name, header_value)
            
            self.end_headers()
            
            # Send body
            if response.content:
                self.wfile.write(response.content)
        
        except Exception as e:
            self.send_error(500, f"Gateway error: {str(e)}")
    
    # Route all methods
    do_GET = _handle_request
    do_POST = _handle_request
    do_PUT = _handle_request
    do_DELETE = _handle_request
    do_PATCH = _handle_request
    do_HEAD = _handle_request
    do_OPTIONS = _handle_request
    
    # Suppress logging
    def log_message(self, format, *args):
        pass

def find_free_port(port=8000):
    """Find a free port"""
    while True:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind(('127.0.0.1', port))
            s.close()
            return port
        except OSError:
            port += 1
            if port > 9000:
                raise Exception("No free ports available")

if __name__ == "__main__":
    port = find_free_port(8000)
    
    print("=" * 70)
    print("PAYMENT SYSTEM - Backend API Gateway")
    print("=" * 70)
    print(f"API URL: http://127.0.0.1:{port}")
    print(f"Docs: http://127.0.0.1:{port}/docs")
    print("=" * 70)
    print("\nServer is running. Press Ctrl+C to stop.\n")
    print("Keep this terminal open!")
    print("=" * 70 + "\n")
    
    server = HTTPServer(('127.0.0.1', port), GatewayHandler)
    
    import signal
    import time
    
    def signal_handler(sig, frame):
        print("\n\nShutting down...")
        server.shutdown()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Serve in a loop
        while True:
            server.handle_request()
            time.sleep(0.001)
    except KeyboardInterrupt:
        print("\n\nServer stopped")
        sys.exit(0)
    except Exception as e:
        print(f"\nError: {e}")
        sys.exit(1)
