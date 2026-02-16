#!/usr/bin/env python
"""
Mock Backend Server using TestClient
For development without server persistence issues
"""
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from starlette.testclient import TestClient

client = TestClient(app)

class MockHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests using TestClient"""
    
    def do_GET(self):
        """Handle GET requests"""
        self.handle_request()
    
    def do_POST(self):
        """Handle POST requests"""
        self.handle_request()
    
    def do_PUT(self):
        """Handle PUT requests"""
        self.handle_request()
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        self.handle_request()
    
    def handle_request(self):
        """Route request through TestClient"""
        try:
            # Parse URL
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            query = parsed.query
            
            # Build full path with query
            url = path + (f"?{query}" if query else "")
            
            # Get body if exists
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Get headers
            headers = dict(self.headers)
            
            # Make request through TestClient
            methods = {
                'GET': client.get,
                'POST': client.post,
                'PUT': client.put,
                'DELETE': client.delete,
            }
            
            method = self.command
            handler = methods.get(method)
            
            if handler:
                if body:
                    response = handler(url, content=body, headers=headers)
                else:
                    response = handler(url, headers=headers)
            else:
                self.send_error(405)
                return
            
            # Send response
            self.send_response(response.status_code)
            
            # Send headers
            for key, value in response.headers.items():
                if key.lower() not in ['content-encoding', 'transfer-encoding']:
                    self.send_header(key, value)
            
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            
            self.end_headers()
            
            # Send body
            if response.content:
                self.wfile.write(response.content)
        
        except Exception as e:
            print(f"Error: {e}")
            self.send_error(500, str(e))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Suppress logging"""
        pass

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 MOCK BACKEND SERVER (TestClient-based)")
    print("="*70)
    print("📍 URL: http://127.0.0.1:8000")
    print("📊 Docs: http://127.0.0.1:8000/docs (not available in mock)")
    print("="*70)
    print("✅ Server running...\n")
    
    try:
        server = HTTPServer(('127.0.0.1', 8000), MockHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
