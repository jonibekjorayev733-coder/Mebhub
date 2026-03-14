# 🚀 VERCEL + RENDER DEPLOY QILISH - 1 CLICK SOLUTION

## ⚡ FAQAT 3 QADAM:

### **QADAM 1: CLI O'RNATISH (Bir marta)**

Windows (PowerShell):
```powershell
npm install -g vercel
```

Mac/Linux:
```bash
npm install -g vercel
```

---

### **QADAM 2: VERCEL'GA LOGIN QILISH**

```powershell
vercel login
```

Keyin:
1. Browser ochiladi
2. "Continue with GitHub" bosing
3. GitHub ruxsat bering
4. Terminal'ga qaytib ayt

---

### **QADAM 3: DEPLOY QILISH**

Windows:
```powershell
.\deploy.bat
```

Mac/Linux:
```bash
bash deploy.sh
```

Yoki:
```bash
npm run deploy
```

---

## 📋 NATIJA:

Deploy script quyidagilarni avtomatik qiladi:

✅ GitHub'ga push qiladi (oxirgi o'zgarishlar)
✅ Frontend Vercel'da deploy qiladi
✅ Backend uchun Render qo'llanmasini ko'rsatadi

---

## 🎯 QAYSI FAYLLARNI ISHLATISH:

| OS | Fayl | Komanda |
|----|----|---------|
| **Windows** | `deploy.bat` | `.\deploy.bat` |
| **Mac/Linux** | `deploy.sh` | `bash deploy.sh` |
| **Barcha** | `deploy.js` | `npm run deploy` |

---

## 🔐 BACKEND UCHUN (RENDER):

Deploy script Frontend'ni avtomatik deploy qiladi, lekin Backend uchun qo'lda bir nechta qadam kerak:

1. **https://render.com ga kiring** (GitHub bilan)
2. **PostgreSQL Database yaratish:**
   - New → PostgreSQL
   - Name: `boardgame-db`
   - PostgreSQL: `15`
   - Create

3. **Web Service yaratish:**
   - New → Web Service
   - Repo: `ITdewjonibek/boardgame`
   - Branch: `becendrot1` ⭐ IMPORTANT!
   - Build: `pip install -r requirements.txt && python migrate.py`
   - Start: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`

4. **Environment Variables qo'ying:**
   ```
   DATABASE_URL = (PostgreSQL'dan nusxalang)
   SECRET_KEY = secret123456789
   ALGORITHM = HS256
   CORS_ORIGINS = ["https://boardgame.vercel.app"]
   ```

---

## 📍 TUGAGANIDAN SO'NG:

Frontend (Vercel): https://boardgame.vercel.app
Backend (Render): https://boardgame-backend.onrender.com

---

## ✨ SUMMARY:

Men deploy scriptlarini yaratdim, siz faqat:

1. Vercel CLI o'rnatib qo'ying: `npm install -g vercel`
2. Login qiling: `vercel login`
3. Script ishga tushiring: `.\deploy.bat` (yoki `bash deploy.sh`)
4. Render'da qo'lda Database + Backend yarating (3 minut)
5. **TUGADI!** 🎉

Muammo bo'lsa - menga ayt!
