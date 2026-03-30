# Google OAuth Setup Guide - Real Credentials

## Why This is Important
This guide will help you set up **real Google OAuth login** so users can:
- Click the Google button
- Select their own Google account
- Sign in with that account
- Just like on real websites!

---

## Step 1: Create Google Cloud Project

1. Go to: **https://console.cloud.google.com**
2. Click **"Select a Project"** at the top
3. Click **"New Project"**
4. Enter project name: `Uzgame` (or any name you prefer)
5. Click **"Create"**
6. Wait for the project to be created (may take 1-2 minutes)

---

## Step 2: Enable Google+ API

1. In the search bar at the top, type: **"Google+ API"**
2. Click on **"Google+ API"** from the results
3. Click the **"ENABLE"** button
4. Wait for it to finish enabling

---

## Step 3: Create OAuth 2.0 Credentials

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** button
3. Select **"OAuth Client ID"**
4. You'll see a warning: "To create an OAuth Client ID, you must first set a user consent screen"
5. Click **"CONFIGURE CONSENT SCREEN"**

---

## Step 4: Configure OAuth Consent Screen

1. Choose **"External"** (for testing)
2. Click **"CREATE"**
3. Fill in the form:
   - **App name**: `Uzgame`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"SAVE AND CONTINUE"**
5. Click **"SAVE AND CONTINUE"** for Scopes
6. Click **"SAVE AND CONTINUE"** for Test Users
7. Click **"BACK TO DASHBOARD"**

---

## Step 5: Create OAuth Client ID (Again)

1. Go back to **Credentials** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth Client ID"**
4. Choose **"Web application"**
5. Give it a name: `Uzgame Frontend`

---

## Step 6: Add Authorized Redirect URIs

In the "Authorized redirect URIs" section, add these URLs:

```
http://localhost:5173
http://localhost:5174
http://localhost:5175
http://localhost:3000
```

**For Production, also add:**
```
https://yourdomain.com
https://yourdomain.com/auth/callback
```

Click **"CREATE"**

---

## Step 7: Copy Your Client ID

1. You'll see a modal with your credentials
2. Copy the **"Client ID"** (looks like: `123456789-abc...apps.googleusercontent.com`)
3. Keep this safe!

---

## Step 8: Add Client ID to Your App

Open `.env.local` file in your project:

```bash
c:\react Jonibek\vite-project\.env.local
```

Replace this line:
```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

With your actual Client ID:
```
VITE_GOOGLE_CLIENT_ID=123456789-abcdefg...apps.googleusercontent.com
```

**Save the file!**

---

## Step 9: Add Client ID to Backend (Optional but Recommended)

Open `Uzgame/.env` file:

```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## Step 10: Test Google Login

1. **Refresh your browser:** `http://localhost:5173`
2. Click the **Google button**
3. You should see a Google popup to **select your account**
4. Select any Google account to sign in
5. You'll be logged in!

---

## Troubleshooting

### "The given client ID is not found"
- Make sure you copied the Client ID correctly
- Restart your dev server after updating `.env.local`
- Clear browser cache (Ctrl+Shift+Delete)

### "Redirect URI mismatch"
- Make sure `http://localhost:5173` is in your authorized redirect URIs list
- If using different port, add that too

### "OAuth consent screen not configured"
- Go to Credentials → Configure Consent Screen
- Complete all required fields and save

---

## Accessing Google Cloud Console

If you forget where you saved your credentials:
1. Go to: **https://console.cloud.google.com**
2. Select your project (top left)
3. Go to **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the edit button (pencil icon)
6. See your authorized URIs
7. Copy the Client ID again if needed

---

## What Happens After Setup

✅ Users can click "Google Button"  
✅ Google account selection popup appears  
✅ User selects/signs into their Google account  
✅ They are automatically logged into Uzgame  
✅ Their Google email is saved in database  
✅ Next time, they can log in the same way  

---

## Need Help?

- Google OAuth Documentation: https://developers.google.com/identity/gsi/web
- Cloud Console: https://console.cloud.google.com
- OAuth 2.0 Flow Diagram: https://developers.google.com/identity/protocols/oauth2

Good luck! 🚀
