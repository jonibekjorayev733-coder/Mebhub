# QUICK REFERENCE - Admin Access Guide

## 🔴 You're Getting 403 Forbidden?

**Reason:** You're not logged in as an admin user.

**Solution:** Log in with one of these accounts:

### Admin Account 1
```
Email: admin@example.com
Password: admin123
```

### Admin Account 2  
```
Email: jane@example.com
Password: (your password for this account)
```

## ✅ What Changed

Updated `/src/context/AuthContext.tsx` to prevent accidental logouts when server validation fails.

**Before:** Login → page refresh → validation fails → logged out  
**Now:** Login → page refresh → validation fails → stays logged in (uses cached data)

## 📋 User Types in System

| User Type | Can Login | Can Access Admin Panel | Example |
|-----------|-----------|------------------------|---------|
| Admin | ✅ Yes | ✅ Yes | admin@example.com |
| Regular | ✅ Yes | ❌ Redirected | demo@example.com |

## 🛠️ Make Someone Admin

1. Log in as admin (admin@example.com)
2. Go to Admin → Authentication
3. Find user in list
4. Click "Make Admin" button
5. User will now have admin access

## 🐛 Troubleshooting

**Still seeing 403?**
1. Check browser console (F12)
2. Verify you're logged in as admin
3. Clear localStorage: `localStorage.clear()` in console
4. Refresh page and log in again

**Token issues?**
1. Tokens last 30 minutes
2. After 30 min, you'll need to log in again
3. Tokens are stored in localStorage (not secure for sensitive apps)

## 🎯 Key Files Modified

- `/src/context/AuthContext.tsx` - More resilient token restoration
- `/Uzgame/app/routers/admin.py` - Added AdminRole integration (recent)
- `/Uzgame/app/models/base.py` - Added AdminRole model (recent)

## 💡 Remember

- **401 error** = No valid token (not logged in)
- **403 error** = Have token but not admin
- **500 error** = Server problem

You're seeing 403 = system is working correctly! Just use admin account.
