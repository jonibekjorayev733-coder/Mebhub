# 🚀 Quick Start Guide - Payment System

## Step 1: Start Backend Server

```bash
cd "c:\react Jonibek\vite-project\Totcbecend"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

✅ Server starts at: **http://127.0.0.1:8000**
📚 API Docs at: **http://127.0.0.1:8000/docs**

## Step 2: Start Frontend Server

```bash
cd "c:\react Jonibek\vite-project"
npm run dev
```

✅ Frontend starts at: **http://localhost:5173**

## Step 3: Test Payment Flow

### 1. Register Account
- Go to http://localhost:5173/signup
- Create account with email & password

### 2. Login
- Go to http://localhost:5173/login
- Login with your credentials

### 3. Browse Courses
- View available courses
- Click on any course card

### 4. Try Payment
- Scroll to "Buy Now" button
- Click to open payment modal
- Enter test card details:
  - **Full Name:** Test User
  - **Email:** test@example.com
  - **Card Number:** 4111 1111 1111 1111
  - **Expiry:** 12/26
  - **CVV:** 123
- Click "Tulov qilish" (Pay)

### 5. Verify Purchase
- After success, you should see course unlocked
- All lessons now accessible
- Payment recorded in history

---

## 🧪 API Testing

### Check Server Health
```bash
curl http://127.0.0.1:8000/
```

### Get Courses
```bash
curl http://127.0.0.1:8000/courses
```

### Get Course Details
```bash
curl http://127.0.0.1:8000/courses/1
```

### View API Documentation
Open browser: **http://127.0.0.1:8000/docs**

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `Totcbecend/app/models.py` | Database Payment model |
| `Totcbecend/app/routers/payments.py` | Payment API endpoints |
| `Totcbecend/app/security.py` | Card encryption & validation |
| `src/Course/Payment/Payment.tsx` | Payment form component |
| `src/api/taskApi.tsx` | API client with auth |

---

## 🔐 Security Notes

- ✅ Card numbers are encrypted before storage
- ✅ Passwords use bcrypt hashing
- ✅ All endpoints require authentication
- ✅ Card data is never logged or displayed
- ✅ Duplicate payments prevented

---

## 📊 Test Data

**3 Pre-loaded Courses:**
1. AWS Certified Solutions Architect ($59.99)
2. Learn Ethical Hacking ($49.99)
3. Advanced Python Programming ($65.00)

**Each course has 7-10 lessons:**
- First 2 lessons: FREE
- Remaining lessons: PAID (require purchase)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Kill any existing Python processes
Get-Process python | Stop-Process -Force

# Try again
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Database errors
```bash
cd Totcbecend
python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine); print('✅ OK')"
```

### API not responding
- Check if server is running on correct port
- Verify firewall isn't blocking port 8000
- Check console for error messages

---

## 💡 Tips

1. **Test Different Cards**
   - Any card with Luhn-valid numbers will work
   - Expiry format: MM/YY (e.g., 12/26)
   - CVV: 3 digits

2. **View Payment History**
   - After purchase, check user dashboard
   - All past payments listed with status

3. **Admin Panel**
   - Access `/payments/admin/all` for all payments
   - View statistics with `/payments/admin/stats`

4. **Error Messages**
   - All errors displayed in modal
   - Check browser console for details
   - Backend logs show detailed info

---

## 📞 Support

If you encounter issues:
1. Check server console for errors
2. Open browser DevTools (F12)
3. Check Network tab for API responses
4. Review backend logs in terminal

---

**Status:** ✅ READY FOR TESTING

*All components implemented and tested*
*System production-ready*
