# 📱 Mobile Login Setup

## Quick Start (For Local Testing on Phone)

Your servers are running:
- ✅ Frontend: `http://localhost:5173` (Vite dev server)
- ✅ Backend: `http://127.0.0.1:8000` (FastAPI)

### Option 1: Test on Same WiFi Network

1. **Get your computer's IP address:**
   ```powershell
   ipconfig
   # Look for IPv4 Address under your active network adapter (e.g., 192.168.x.x)
   ```

2. **On your phone, open browser and go to:**
   ```
   http://YOUR_IP:5173
   ```
   Replace `YOUR_IP` with your actual IP address

3. **Update `.env` file for API calls:**
   ```dotenv
   VITE_API_BASE_URL=http://YOUR_IP:8000
   VITE_FRONTEND_URL=http://YOUR_IP:5173
   ```

4. **Restart frontend server:** `npm run dev`

5. **Test login on phone:**
   - Demo Email: `demo@example.com`
   - Password: `demo123`

### Option 2: Using ngrok (Best for Sharing)

See `MOBILE_ACCESS.md` for detailed ngrok setup.

### Troubleshooting Mobile Login

**"Failed to fetch" error?**
- ✗ API URL is wrong or unreachable from phone
- ✓ Check VITE_API_BASE_URL in .env
- ✓ Ensure backend is running on port 8000
- ✓ Firewall might be blocking - try disabling it temporarily

**"Network timeout"?**
- ✓ Check phone is on same WiFi as computer
- ✓ Verify IP address is correct (test with ping)
- ✓ Check backend logs for actual errors

**"401 Unauthorized"?**
- ✓ Email/password wrong - try demo credentials
- ✓ Database might not have test users
- ✓ Check backend logs for authentication errors

### Demo Accounts

```
Email: demo@example.com
Password: demo123

Email: admin@example.com
Password: admin123
```

### Backend Server Status

Check if backend is responding:
```
curl http://127.0.0.1:8000/health
```

Should return:
```json
{"status":"ok","version":"1.0.0","api":"Uzgame Medical Education API"}
```

### Hot Reload on Mobile

When you make code changes:
1. Frontend automatically hot-reloads (Vite HMR)
2. Just refresh the phone browser
3. No need to restart servers

Happy testing! 🚀
