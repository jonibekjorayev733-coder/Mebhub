#!/usr/bin/env python
"""Simple HTTP proxy server on port 8080"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from starlette.testclient import TestClient
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from app.main import app
client = TestClient(app)

class ProxyHandler(BaseHTTPRequestHandler):
    def handle_request(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            url = parsed.path
            if parsed.query:
                url += f"?{parsed.query}"
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            headers = dict(self.headers)
            
            if self.command == 'GET':
                resp = client.get(url, headers=headers)
            elif self.command == 'POST':
                resp = client.post(url, content=body, headers=headers)
            elif self.command == 'PUT':
                resp = client.put(url, content=body, headers=headers)
            elif self.command == 'DELETE':
                resp = client.delete(url, headers=headers)
            else:
                self.send_error(405)
                return
            
            self.send_response(resp.status_code)
            for k, v in resp.headers.items():
                if k.lower() not in ['content-encoding']:
                    self.send_header(k, v)
            self.end_headers()
            self.wfile.write(resp.content)
        except Exception as e:
            self.send_error(500, str(e))
    
    def do_GET(self):
        self.handle_request()
    def do_POST(self):
        self.handle_request()
    def do_PUT(self):
        self.handle_request()
    def do_DELETE(self):
        self.handle_request()
    def log_message(self, *args):
        pass

if __name__ == "__main__":
    print("=" * 70)
    print("BACKEND API SERVER - Port 8080")
    print("=" * 70)
    print("API: http://127.0.0.1:8080")
    print("=" * 70)
    
    server = HTTPServer(("0.0.0.0", 8080), ProxyHandler)
    print("Server started - Press Ctrl+C to stop\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
