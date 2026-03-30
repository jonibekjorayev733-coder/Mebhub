# 🚀 Start Your Application

## Quick Commands

### Terminal 1: Start Backend (Python)
```powershell
cd "c:\react Jonibek\vite-project\Uzgame"
python -m uvicorn app.main:app --reload --port 8000
```

Expected Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Terminal 2: Start Frontend (Node.js)
```powershell
cd "c:\react Jonibek\vite-project"
npm run dev
```

Expected Output:
```
VITE v5.4.19  ready in 907 ms
➜  Local:   http://localhost:5174/
```

## Access Your App

### Application
👉 **http://localhost:5174/login**

### API Documentation (Swagger)
👉 **http://localhost:8000/docs**

### Health Check
👉 **http://localhost:8000/health**

## Test Login Credentials

**Email/Password (created during testing):**
- Email: `test@example.com`
- Password: `password123`

**Or create new account:**
- Go to login page
- Click "Register" tab
- Fill in your details
- Click "Register"

## What You'll See

### Login Page
- Email input field
- Password input field
- "Register" tab to create account
- "Sign in with Google" button
- Toggle between Login/Register modes

### Dashboard (After Login)
- User name and email displayed
- Authentication provider shown
- Medical education app content
- Logout button in top right

### Medical App
- Learning Mode
- Test Mode
- Topic Hub
- Landing Page

## Troubleshooting

### Both servers down?
1. Make sure you're in the correct directories
2. Check if ports 8000 and 5174 are available
3. Look for error messages in terminal output

### Frontend can't connect to backend?
1. Check backend is running on localhost:8000
2. Check `.env.local` has correct API_BASE_URL
3. Check browser console for CORS errors

### Google login not working?
1. You need to configure Google OAuth (see AUTHENTICATION_SETUP.md)
2. Email/Password login works without configuration
3. Add VITE_GOOGLE_CLIENT_ID to .env.local

### Stuck on loading?
1. Press F12 to open DevTools
2. Check Console tab for errors
3. Check Network tab to see API responses
4. Clear localStorage and refresh

## File Structure Reference

```
Frontend code:          src/
Backend code:           Uzgame/app/
Frontend config:        .env.local
Backend config:         Uzgame/.env
Frontend build:         dist/
Backend database:       Uzgame/app.db
```

## Documentation

- **Setup & Configuration:** AUTHENTICATION_SETUP.md
- **Complete Implementation:** IMPLEMENTATION_COMPLETE.md
- **Quick Start Guide:** QUICKSTART.md
- **This File:** RUN.md

## API Endpoints Quick Reference

```
Register:      POST   http://localhost:8000/auth/register
Login:         POST   http://localhost:8000/auth/login
Google Login:  POST   http://localhost:8000/auth/google-login
Get User:      GET    http://localhost:8000/auth/me
Update Profile PUT    http://localhost:8000/auth/profile
Health:        GET    http://localhost:8000/health
Docs:          GET    http://localhost:8000/docs
```

## Features Available

✅ Email/Password authentication  
✅ Google OAuth 2.0 (requires setup)  
✅ Session persistence  
✅ Protected routes  
✅ User profile display  
✅ Logout functionality  
✅ Medical learning app  
✅ Test mode  
✅ Learning mode  

## Next Steps

1. ✅ Start both servers
2. ✅ Go to http://localhost:5174/login
3. ✅ Register or login
4. ✅ Explore the app
5. ✅ (Optional) Setup Google OAuth for Sign-In

## Need Help?

1. Check the documentation files (AUTHENTICATION_SETUP.md, etc.)
2. Open browser DevTools (F12) to see errors
3. Check terminal output for server errors
4. Review API documentation at http://localhost:8000/docs

---

**Everything is ready to run! 🚀**

Just follow the Quick Commands above and you're good to go!
