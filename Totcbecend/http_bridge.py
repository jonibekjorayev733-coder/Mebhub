#!/usr/bin/env python
"""HTTP Server using FastAPI TestClient as the backend"""
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from starlette.testclient import TestClient

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from app.main import app

client = TestClient(app)

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.route_request()
    
    def do_POST(self):
        self.route_request()
    
    def do_PUT(self):
        self.route_request()
    
    def do_DELETE(self):
        self.route_request()
    
    def route_request(self):
        try:
            # Parse URL
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path
            query = parsed.query
            
            # Reconstruct URL for TestClient
            url = path
            if query:
                url += f"?{query}"
            
            # Read body if POST/PUT
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length else None
            
            # Prepare headers
            headers = dict(self.headers)
            
            # Make request to FastAPI app
            if self.command == 'GET':
                response = client.get(url, headers=headers)
            elif self.command == 'POST':
                response = client.post(url, content=body, headers=headers)
            elif self.command == 'PUT':
                response = client.put(url, content=body, headers=headers)
            elif self.command == 'DELETE':
                response = client.delete(url, headers=headers)
            else:
                self.send_error(405)
                return
            
            # Send response
            self.send_response(response.status_code)
            for key, value in response.headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(response.content)
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == "__main__":
    print("=" * 70)
    print("BACKEND - Payment System (HTTP Bridge)")
    print("=" * 70)
    print("URL: http://127.0.0.1:8000")
    print("Docs: http://127.0.0.1:8000/docs")
    print("=" * 70)
    print()
    
    server = HTTPServer(("127.0.0.1", 8000), APIHandler)
    print("Server started on http://127.0.0.1:8000")
    print("Press Ctrl+C to stop\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        server.shutdown()
