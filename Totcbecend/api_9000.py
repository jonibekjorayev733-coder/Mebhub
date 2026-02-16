#!/usr/bin/env python
"""Backend API on port 9000"""
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
    def _handle(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            url = parsed.path + (f"?{parsed.query}" if parsed.query else "")
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            methods = {'GET': client.get, 'POST': client.post, 'PUT': client.put, 'DELETE': client.delete}
            r = methods.get(self.command, lambda *a, **k: None)(url, content=body if body else None)
            
            if not r:
                self.send_error(405)
                return
            
            self.send_response(r.status_code)
            for k, v in r.headers.items():
                if k.lower() not in ['content-encoding']:
                    self.send_header(k, v)
            self.end_headers()
            if r.content:
                self.wfile.write(r.content)
        except Exception as e:
            self.send_error(500, str(e))
    
    do_GET = do_POST = do_PUT = do_DELETE = _handle
    def log_message(self, *args): pass

if __name__ == "__main__":
    print("Backend API on port 9000\nKeep open!\n")
    server = HTTPServer(('127.0.0.1', 9000), Handler)
    try:
        server.serve_forever()
    except: pass
