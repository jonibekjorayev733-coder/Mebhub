#!/usr/bin/env python
"""Ultra-simple HTTP server using only stdlib - no external servers"""
import socket
import os
import sys
from io import BytesIO

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def parse_http_request(data):
    """Parse raw HTTP request"""
    lines = data.decode().split('\r\n')
    if not lines:
        return None
    
    request_line = lines[0].split()
    if len(request_line) < 3:
        return None
    
    method, path, version = request_line[0], request_line[1], request_line[2]
    
    headers = {}
    body_start = 0
    for i, line in enumerate(lines[1:], 1):
        if line == '':
            body_start = i + 1
            break
        if ':' in line:
            k, v = line.split(':', 1)
            headers[k.strip()] = v.strip()
    
    body = b''
    if body_start < len(lines):
        body = '\r\n'.join(lines[body_start:]).encode()
    
    return method, path, headers, body

def handle_client(sock):
    """Handle a single client connection"""
    try:
        # Receive request
        request_data = sock.recv(8192)
        if not request_data:
            return
        
        parsed = parse_http_request(request_data)
        if not parsed:
            sock.close()
            return
        
        method, path, headers, body = parsed
        
        # Make request to FastAPI
        try:
            if method == 'GET':
                resp = client.get(path)
            elif method == 'POST':
                resp = client.post(path, content=body)
            elif method == 'PUT':
                resp = client.put(path, content=body)
            elif method == 'DELETE':
                resp = client.delete(path)
            else:
                resp = client.get(path)  # Default to GET
        except:
            sock.send(b"HTTP/1.1 500 Internal Server Error\r\n\r\n")
            sock.close()
            return
        
        # Build HTTP response
        status_line = f"HTTP/1.1 {resp.status_code} OK\r\n"
        
        response_headers = ""
        for k, v in resp.headers.items():
            if k.lower() not in ['content-encoding']:
                response_headers += f"{k}: {v}\r\n"
        
        response = status_line.encode() + response_headers.encode() + b"\r\n" + resp.content
        sock.send(response)
        sock.close()
    
    except Exception as e:
        try:
            sock.send(f"HTTP/1.1 500 Error\r\n\r\n{str(e)}".encode())
        except:
            pass
        finally:
            sock.close()

if __name__ == "__main__":
    HOST = '127.0.0.1'
    PORT = 8000
    
    print("=" * 70)
    print("BACKEND - Pure Socket Server (No External Dependencies)")
    print("=" * 70)
    print(f"URL: http://{HOST}:{PORT}")
    print("=" * 70)
    print("\nServer running. Press Ctrl+C to stop.\n")
    
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    
    try:
        while True:
            client_socket, address = server_socket.accept()
            handle_client(client_socket)
    except KeyboardInterrupt:
        print("\nServer stopped")
    finally:
        server_socket.close()
