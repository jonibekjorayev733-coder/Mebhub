# 🚀 Frontend Google OAuth Integration - Setup Guide

## ✅ What's Been Implemented

### Frontend Components Created:

1. **Authentication Service** (`src/utils/authService.ts`)
   - `register()` - Register new users with email/password
   - `login()` - Login with email/password
   - `googleLogin()` - Login with Google OAuth token
   - `getCurrentUser()` - Get authenticated user info
   - `updateProfile()` - Update user profile

2. **Auth Context** (`src/context/AuthContext.tsx`)
   - Manages authentication state globally
   - Stores/retrieves token from localStorage
   - Provides `useAuth()` hook for all components
   - Handles auto-login on page refresh

3. **Login Page** (`src/pages/LoginPage.tsx`)
   - Email/password registration form
   - Email/password login form
   - Google Sign-In button
   - Error handling and validation
   - Toggle between login/register modes

4. **Google Sign-In Component** (`src/Components/GoogleSignIn.tsx`)
   - Integrated with @react-oauth/google library
   - Captures Google ID token
   - Sends to backend `/auth/google-login` endpoint
   - Handles errors gracefully

5. **Dashboard** (`src/pages/Dashboard.tsx`)
   - User profile header with name/email
   - Logout button
   - Embedded medical app content
   - Shows "Signed in with Google" indicator

6. **Protected Routes** (in `App.tsx`)
   - Automatic redirect to login if not authenticated
   - Loading state during auth check
   - Auto-redirect to dashboard when already logged in

## 🔧 Setup Instructions

### Step 1: Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5174` (your frontend port)
   - `http://localhost:5176` (alternative)
7. Copy your **Client ID**

### Step 2: Configure Environment Variables

Edit `.env.local` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE
```

Replace `YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID from Step 1.

### Step 3: Update Backend Environment

Edit `Uzgame/.env`:

```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

These are optional for verification but recommended for production.

### Step 4: Start Both Servers

**Terminal 1 - Frontend (already running on 5174):**
```powershell
cd "c:\react Jonibek\vite-project"
npm run dev
```

**Terminal 2 - Backend:**
```powershell
cd "c:\react Jonibek\vite-project\Uzgame"
python -m uvicorn app.main:app --reload --port 8000
```

## 🧪 Testing the System

### Email/Password Flow:
1. Navigate to `http://localhost:5174/login`
2. Click "Register" tab
3. Enter email, password, full name
4. Click "Register" button
5. Auto-redirected to dashboard

### Google OAuth Flow:
1. Navigate to `http://localhost:5174/login`
2. Click "Sign in with Google" button
3. Sign in with your Google account
4. Auto-logged in and redirected to dashboard

### Protected Routes:
1. Try accessing `http://localhost:5174/` without logging in
2. Should redirect to `/login`
3. After login, dashboard is accessible
4. Click "Logout" button to clear session

## 📁 Frontend File Structure

```
src/
├── utils/
│   └── authService.ts           # API calls to backend
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── Components/
│   └── GoogleSignIn.tsx         # Google OAuth button
├── pages/
│   ├── LoginPage.tsx            # Login/Register forms
│   └── Dashboard.tsx            # Main app with user header
├── App.tsx                      # Routes & auth provider
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## 🔐 How It Works

### Login Flow:
```
User fills email/password
    ↓
Sends to /auth/login endpoint
    ↓
Backend validates & generates JWT token
    ↓
Token + user info stored in localStorage
    ↓
Auth context updated
    ↓
Redirect to dashboard
```

### Google OAuth Flow:
```
User clicks "Sign in with Google"
    ↓
Google OAuth popup
    ↓
User authenticates with Google
    ↓
Google returns ID token
    ↓
Token sent to /auth/google-login endpoint
    ↓
Backend verifies token & creates/finds user
    ↓
Backend returns JWT + user info
    ↓
Token + user info stored in localStorage
    ↓
Auto-redirect to dashboard
```

## 🎯 Key Features

✅ **Dual Authentication**
- Email/password for traditional login
- Google OAuth for seamless sign-in

✅ **Session Persistence**
- Tokens saved in localStorage
- Auto-login on page refresh
- Secure Bearer token in API headers

✅ **Protected Routes**
- Automatic redirect to login if not authenticated
- Loading state during auth validation
- Logout clears all session data

✅ **User Profile**
- Display user name & email in dashboard
- Show authentication provider
- Update profile endpoint available

✅ **Error Handling**
- User-friendly error messages
- Form validation
- API error responses handled gracefully

## 🌐 API Endpoints Used

All endpoints are called via `src/utils/authService.ts`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Authenticate with email/password |
| POST | `/auth/google-login` | Authenticate with Google token |
| GET | `/auth/me` | Get current user (protected) |
| PUT | `/auth/profile` | Update user profile (protected) |
| POST | `/auth/logout` | Logout endpoint |

## ⚠️ Important Notes

1. **Google Client ID is Public**
   - Keep it in environment variables, not hardcoded
   - It's safe to expose (by design of OAuth 2.0)
   - Secret key should NOT be exposed to frontend

2. **CORS Configuration**
   - Backend has CORS enabled for all origins (`*`)
   - In production, restrict to your frontend domain

3. **Token Security**
   - Tokens stored in localStorage (accessible via JavaScript)
   - For production: use httpOnly cookies instead
   - Never store sensitive data in localStorage

4. **Database State**
   - Backend uses SQLite with user registration
   - Google OAuth auto-creates users on first login
   - Users are NOT deleted when logging out (session only)

## 🚨 Troubleshooting

### "Module not found: '@react-oauth/google'"
```powershell
npm install @react-oauth/google --legacy-peer-deps
```

### "Connection refused" when accessing backend
- Ensure backend is running: `python -m uvicorn app.main:app --port 8000`
- Check if port 8000 is available
- Look for error messages in backend terminal

### "Google login failed" message
- Verify `VITE_GOOGLE_CLIENT_ID` is correct in `.env.local`
- Check Google Cloud Console project settings
- Ensure `http://localhost:5174` is in authorized URIs
- Check browser console for detailed error

### "CORS error"
- Backend should allow all origins (currently enabled)
- If not working, check `app/main.py` CORS configuration

### Page keeps redirecting to login
- Clear localStorage: Open DevTools → Application → localStorage → Clear All
- Refresh page
- Try logging in again

## 📞 Backend Status Check

Open your browser to `http://localhost:8000/docs` to see:
- All available API endpoints
- Interactive API testing interface
- Request/response schemas
- Health check endpoint

## 🎉 You're All Set!

Your medical education app now has:
- ✅ Complete authentication system
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Session persistence
- ✅ User dashboard

Happy coding! 🚀
