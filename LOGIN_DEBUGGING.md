# 🔧 Mobile Login Debugging Guide

## Your Situation
- Backend API: ✅ **WORKS** (tested with Python)
- Frontend: ❌ **Login not working on mobile**
- Error: "Failed to fetch" or similar network errors

## Step-by-Step Debugging

### Step 1: Test Backend is Running
```powershell
# Run this to verify backend is working
python test_login_mobile.py
```

Expected output:
```
✅ LOGIN SUCCESSFUL
Token: eyJhbGciOi...
```

If you see `❌ LOGIN FAILED` or error, backend needs restart.

---

### Step 2: Check Browser Console on Mobile

1. Open your phone's browser
2. Go to: `http://YOUR_COMPUTER_IP:5173`
3. Open Developer Console (F12 or Developer Tools)
4. Go to **Console** tab
5. Try to login and look for messages starting with `[AuthService]`

**Expected messages:**
```
[AuthService] Using configured API URL: http://YOUR_IP:8000
[AuthService] Login attempt: { url: 'http://YOUR_IP:8000/auth/login', email: '...', ... }
[AuthService] Login response status: 200
[AuthService] Login successful: demo@example.com
```

**If you see errors instead, note them below:**

---

### Step 3: Configure API URL in `.env`

The most common issue: **API_BASE_URL is wrong or not set**.

1. **Get your computer's IP:**
   ```powershell
   ipconfig
   ```
   Look for IPv4 address like `192.168.x.x` or `10.x.x.x`

2. **Update `.env` file:**
   ```dotenv
   VITE_API_BASE_URL=http://YOUR_IP:8000
   VITE_FRONTEND_URL=http://YOUR_IP:5173
   ```

   Example:
   ```dotenv
   VITE_API_BASE_URL=http://192.168.1.100:8000
   VITE_FRONTEND_URL=http://192.168.1.100:5173
   ```

3. **Restart frontend:**
   ```powershell
   npm run dev
   ```

4. **Wait** for Vite to fully start (look for "ready in Xms")

5. **Hard refresh on phone:** 
   - Clear browser cache or open in private/incognito mode
   - Go to: `http://YOUR_IP:5173`

---

### Step 4: Verify Network Access

**From your phone, test if you can reach the backend:**

1. Open phone browser
2. Go to: `http://YOUR_IP:8000/health`
3. Should see:
   ```json
   {"status":"ok","version":"1.0.0","api":"Uzgame Medical Education API"}
   ```

**If you get "Cannot reach server":**
- ❌ Firewall is blocking - disable Windows Firewall temporarily
- ❌ IP address is wrong - double-check with `ipconfig`
- ❌ Phone and computer not on same WiFi - connect them
- ❌ Backend server crashed - restart it

---

### Step 5: Test Login

1. Go to: `http://YOUR_IP:5173`
2. Use credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
3. Open browser console (Developer Tools)
4. Click Login and watch the console messages

---

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause:** Network can't reach backend URL

**Fix:**
```dotenv
# Make sure this is YOUR actual IP, not localhost
VITE_API_BASE_URL=http://192.168.1.100:8000
```

### Issue: "401 Unauthorized"
**Cause:** Wrong email/password

**Fix:**
- Use exact credentials: `demo@example.com` / `demo123`
- Or: `admin@example.com` / `admin123`

### Issue: "Network timeout"
**Cause:** Backend is slow or crashed

**Fix:**
```powershell
# Restart backend
cd c:\react Jonibek\vite-project\Uzgame
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Issue: "CORS error"
**Should NOT happen** - backend allows all origins

If you see CORS error, there's a deeper issue. Check backend logs.

---

## Quick Checklist

- [ ] Backend is running on port 8000
- [ ] Frontend is running (Vite shows "ready in Xms")
- [ ] `.env` has correct `VITE_API_BASE_URL=http://YOUR_IP:8000`
- [ ] Phone is on same WiFi as computer
- [ ] `http://YOUR_IP:8000/health` returns JSON (test from phone)
- [ ] Using correct login credentials
- [ ] Refreshed browser page (clear cache if needed)
- [ ] Checked browser console for `[AuthService]` messages

---

## Emergency Reset

If nothing works, try complete restart:

```powershell
# Stop all processes
Get-Process node, python -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 3

# Clear all npm/vite caches
npm run clean 2>$null; npm install

# Restart frontend
cd "c:\react Jonibek\vite-project"
npm run dev

# In NEW terminal, restart backend
cd "c:\react Jonibek\vite-project\Uzgame"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## Still Not Working?

1. **Take a screenshot of the browser console error**
2. **Check the backend server output** for error messages
3. **Run test script again:**
   ```powershell
   python test_login_mobile.py
   ```
4. **Share the exact error message** - it will help identify the issue

Your backend login **definitely works** - so it's just a configuration issue! 🚀
