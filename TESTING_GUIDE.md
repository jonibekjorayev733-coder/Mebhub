# 🧪 TESTING GUIDE - UZGAME AUTHENTICATION

## Quick Test Instructions

### ✅ Step 1: Open Application
Open browser and go to: `http://localhost:5174`

You will see the login page (not the home page) because you're not authenticated yet.

---

## ✅ Step 2: Test Login with Existing User

### Click: **KIRISH** tab (top of form)

**Enter:**
```
Email: test@example.com
Password: test123
```

**Click:** KIRISH button

**Expected Result:**
- ✅ Redirected to home page (Dashboard)
- ✅ Medical learning content visible
- ✅ Header shows: `test@example.com [CHIQISH]` button
- ✅ You can see all learning materials

---

## ✅ Step 3: Test Logout

**Click:** CHIQISH button in header

**Expected Result:**
- ✅ Logged out
- ✅ Redirected to login page
- ✅ All user info cleared
- ✅ Cannot access dashboard anymore

---

## ✅ Step 4: Test Protected Routes

**Try to access dashboard without logging in:**

1. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application → LocalStorage
   - Delete all entries
   - Close DevTools

2. Refresh page (F5)

**Expected Result:**
- ✅ Redirected to `/login` automatically
- ✅ Can't access home page without credentials
- ✅ This protects your content

---

## ✅ Step 5: Test Registration

### Click: **RO'YXAT** tab

**Enter:**
```
Email: newuser@example.com
Password: password123
Full Name: John Doe
```

**Click:** Ro'yxatdan O'tish button

**Expected Result:**
- ✅ User created successfully
- ✅ Form clears
- ✅ New tab: KIRISH shows
- ✅ Try logging in with new credentials

---

## ✅ Step 6: Verify Database

Open terminal and run:

```powershell
cd "c:\react Jonibek\vite-project\Uzgame"
python run_tests.py
```

**Expected Result:**
```
✅ TEST 1: Register - Status 400 (email exists)
✅ TEST 2: Login - Status 200 ✅
✅ TEST 3: Get User - Status 200 ✅
✅ TEST 4: Health - Status 200 ✅
```

---

## ✅ Step 7: Test Session Persistence

**Your token is saved in localStorage, so:**

1. Login with: `test@example.com` / `test123`
2. Refresh page (F5)
3. You stay logged in ✅ (no need to login again)

**Try:**
- Close browser tab
- Open new tab to `http://localhost:5174`
- You stay logged in (token in localStorage)
- This is automatic session persistence

---

## 🔐 Test Cases Summary

| Test | Action | Expected | Status |
|------|--------|----------|--------|
| **Login** | Enter credentials | JWT token received | ✅ |
| **Dashboard** | After login | See medical content | ✅ |
| **Header** | Logged in | Email + Logout button | ✅ |
| **Logout** | Click logout | Redirected to login | ✅ |
| **Protected Route** | No token, access / | Redirect to /login | ✅ |
| **Register** | New credentials | User created in DB | ✅ |
| **Session** | Refresh page | Stay logged in | ✅ |
| **Mobile** | On phone/tablet | Responsive menu | ✅ |

---

## 🎨 UI Elements to Check

### Login Page Should Show:
- ✅ Dark background (dark blue/black)
- ✅ Orange accent buttons (#ff6b00)
- ✅ "L" logo in orange
- ✅ "Uzgame" title
- ✅ "Tibbiy terminologiyani o'rganing" subtitle
- ✅ KIRISH / RO'YXAT tabs (Uzbek)
- ✅ Email input field
- ✅ Password input field
- ✅ KIRISH button (orange)
- ✅ "Hisobingiz yo'qmi? Ro'yxat" link

### Dashboard Should Show:
- ✅ Header with navigation
- ✅ Your email (top right)
- ✅ CHIQISH (logout) button
- ✅ BOSHLASH button
- ✅ Medical learning cards
- ✅ Learning mode and test mode
- ✅ Dark theme with orange accents

---

## 🐛 Troubleshooting

### Problem: "Login page not showing"
**Solution:** Make sure frontend is running
```powershell
cd "c:\react Jonibek\vite-project"
npm run dev
```

### Problem: "Email or password incorrect"
**Solution:** Make sure you're using correct credentials:
- `test@example.com` / `test123`
- `admin@example.com` / `admin123`

### Problem: "Backend server error"
**Solution:** Make sure backend is running
```powershell
cd "c:\react Jonibek\vite-project\Uzgame"
python -m uvicorn app.main:app --port 8000
```

### Problem: "Can't register new user"
**Solution:** Email might already exist. Try different email.

### Problem: "Staying on login page after login"
**Solution:** 
1. Check browser console for errors (F12)
2. Make sure backend is responding (check http://localhost:8000/health)
3. Try clearing localStorage and login again

---

## 📱 Mobile Testing

**On Mobile Browser:**
1. Open `http://localhost:5174` (or your computer's IP:5174)
2. You see hamburger menu (☰)
3. Click menu to see options
4. Login/logout works the same
5. All forms are responsive

---

## 🎯 Testing Checklist

- [ ] Login with test@example.com works
- [ ] Can see dashboard after login
- [ ] Header shows email and logout button
- [ ] Logout redirects to login page
- [ ] Can't access dashboard without login
- [ ] Registration creates new user
- [ ] New user can login
- [ ] Session persists on page refresh
- [ ] Mobile menu works
- [ ] All buttons have orange color
- [ ] Login page matches dark theme
- [ ] No error messages in console

---

## ✨ Everything Should Be Working!

If you find any issues, check:

1. **Are both servers running?**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:8000/health

2. **Is database accessible?**
   - Check `app.db` exists in Uzgame folder
   - Run tests: `python run_tests.py`

3. **Is there a network error?**
   - Open DevTools (F12) → Network tab
   - Try login and watch the requests
   - Should see POST to http://localhost:8000/auth/login

---

## 🎉 Test Complete!

All features are working and ready for use! 🚀
