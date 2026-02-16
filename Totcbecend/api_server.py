#!/usr/bin/env python
"""Simple HTTP gateway that proxies to FastAPI via TestClient"""
import os
import sys
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from app.main import app
from starlette.testclient import TestClient

client = TestClient(app)

class Handler(BaseHTTPRequestHandler):
    """HTTP proxy handler"""
    
    def _handle(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            url = parsed.path + (f"?{parsed.query}" if parsed.query else "")
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            if self.command == 'GET':
                r = client.get(url)
            elif self.command == 'POST':
                r = client.post(url, content=body)
            elif self.command == 'PUT':
                r = client.put(url, content=body)
            elif self.command == 'DELETE':
                r = client.delete(url)
            elif self.command == 'PATCH':
                r = client.patch(url, content=body)
            elif self.command == 'OPTIONS':
                r = client.options(url)
            else:
                self.send_error(405)
                return
            
            self.send_response(r.status_code)
            for k, v in r.headers.items():
                if k.lower() not in ['content-encoding', 'transfer-encoding']:
                    self.send_header(k, v)
            self.end_headers()
            if r.content:
                self.wfile.write(r.content)
        
        except Exception as e:
            self.send_error(500, str(e))
    
    do_GET = _handle
    do_POST = _handle
    do_PUT = _handle
    do_DELETE = _handle
    do_PATCH = _handle
    do_OPTIONS = _handle
    
    def log_message(self, *args):
        pass

if __name__ == "__main__":
    port = 8000
    
    print("=" * 70)
    print("PAYMENT SYSTEM - Backend API")
    print("=" * 70)
    print(f"URL: http://127.0.0.1:{port}")
    print(f"Keep terminal open - do NOT close!")
    print("=" * 70 + "\n")
    
    server = HTTPServer(('127.0.0.1', port), Handler)
    print("Server running...\n")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped")
