# Mobile & External Access via ngrok

## Problem
When accessing the app via ngrok tunnel on mobile (e.g., `https://xyz.ngrok-free.dev`), login fails because:
- Frontend runs on ngrok domain
- API calls try to reach `http://127.0.0.1:8000` (localhost) which doesn't work from mobile
- This results in 400 errors and "Cannot reach server"

## Solution: Run Backend on Separate ngrok Tunnel

You need to run **both** frontend and backend on separate ngrok tunnels for mobile access to work.

### Step-by-Step Setup

#### 1. Ensure ngrok is Installed
```bash
# Download from https://ngrok.com/download
# Or if using package manager:
choco install ngrok  # Windows
brew install ngrok   # macOS
```

#### 2. Get Your ngrok Auth Token
1. Go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your auth token
3. Run: `ngrok config add-authtoken YOUR_TOKEN`

#### 3. Start Backend API on ngrok (New Terminal)
```bash
cd Uzgame
ngrok http 8000
```
You'll see output like:
```
Forwarding https://abc1234def5678.ngrok-free.dev -> http://localhost:8000
```
**Copy the HTTPS URL** (e.g., `https://abc1234def5678.ngrok-free.dev`)

#### 4. Update Frontend Configuration
Edit `.env` file in the project root:
```dotenv
# Replace with YOUR actual ngrok URL from step 3
VITE_API_BASE_URL=https://abc1234def5678.ngrok-free.dev
VITE_FRONTEND_URL=https://xyz9876uvw5432.ngrok-free.dev
```

#### 5. Start Frontend (New Terminal)
```bash
npm run dev
```
Look for ngrok URL in the output, it will be on port 5173

#### 6. Access on Mobile
1. Copy the frontend ngrok URL from terminal
2. Open in mobile browser: `https://xyz9876uvw5432.ngrok-free.dev`
3. **Login should now work!** ✅

### Important Notes

⚠️ **Every time you restart ngrok tunnels:**
- Backend ngrok URL will change
- You must update `VITE_API_BASE_URL` in `.env`
- Restart `npm run dev` to apply changes

✅ **For Local Development (Default):**
```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_FRONTEND_URL=http://localhost:5173
```

### Troubleshooting

**Still getting 400 errors?**
- Verify backend ngrok is running
- Check you're using HTTPS in the ngrok URL (not HTTP)
- Verify `VITE_API_BASE_URL` in `.env` is correct
- Restart `npm run dev` after changing `.env`

**Login redirects to localhost?**
- Make sure you're accessing via ngrok URL, not localhost
- Clear browser cache/localStorage if needed

**Google login not working?**
- Google OAuth credentials are not configured in this setup
- Use email/password login for testing
- To enable Google OAuth, configure OAuth credentials in backend

### Architecture Diagram

```
Mobile Phone (192.168.1.100)
    ↓
    ↓ https://abc1234.ngrok-free.dev (Frontend)
    ↓
Frontend ngrok tunnel
    ↓
    ↓ http://localhost:5173
    ↓
Vite Dev Server
    ↓
    ├─ Direct API calls to: https://xyz5678.ngrok-free.dev (Backend)
    │
    └─ Or Vite proxy (dev only) to: http://127.0.0.1:8000


Backend ngrok tunnel
    ↓
    ↓ http://localhost:8000
    ↓
FastAPI Server (Uzgame)
    ↓
PostgreSQL Database
```

### For Production Deployment
When deploying to production:
1. Use real domain names, not ngrok
2. Update `VITE_API_BASE_URL` to production API URL
3. Ensure CORS is properly configured on backend
4. Use HTTPS for all connections
