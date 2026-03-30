# 🚀 Mebhub - Medical Education Platform

## Quick Start Guide

### 1. **Access the Application**
- Frontend: http://localhost:5174
- Backend API: http://127.0.0.1:8000
- Database: PostgreSQL (med)

### 2. **Login Credentials**

You'll see demo credentials on the login page. Choose one:

#### 🟢 Recommended (Demo Account)
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: Administrator

#### 🔵 Alternative (Admin Account)
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Administrator

### 3. **Admin Panel Features**

After logging in, navigate to `/admin` to access:

#### Dashboard (`/admin`)
- Real-time database statistics
- Topics count: 4
- Learning items: 160
- Test questions: 120
- Total users: 14+

#### Authentication (`/admin/authentication`)
- **Manage Users**: View all registered users
- **Create Admins**: Add new administrator accounts
- **Promote Users**: Convert regular users to admins with one click
- **Demote Admins**: Remove admin status from administrators
- **Delete Users**: Remove user accounts
- **Real-time Updates**: Changes reflect instantly (every 2 seconds)

#### Test Add (`/admin/test-add`)
- **Mavzular (Topics)**: Add medical topics
- **O'rganish (Learning Items)**: Add Latin/Uzbek terminology pairs
- **Savollar (Questions)**: Add test questions with multiple choice options

### 4. **Key Improvements**

✅ **Authentication**
- Bcrypt password hashing with 72-byte truncation
- JWT token-based authorization
- Email/password login

✅ **User Management**
- Real-time user status updates
- Promote/demote admin functionality
- User deletion with confirmation

✅ **Content Management**
- Add/edit/delete topics
- Add/edit/delete learning items
- Add/edit/delete test questions
- All changes reflected in real-time

✅ **Error Handling**
- Clear error messages
- Console logging for debugging
- User-friendly alerts

✅ **Security**
- Admin-only endpoints
- JWT token validation
- CORS enabled for development

### 5. **Running the Application**

#### Start Backend
```bash
cd Uzgame
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Start Frontend
```bash
npm run dev
```

Both servers will start automatically in development mode.

### 6. **Database**

- **Type**: PostgreSQL
- **Name**: `med`
- **Connection**: `postgresql://postgres:jonibek@127.0.0.1:5432/med`
- **Users Table**: `med` (email, password_hash, full_name, is_admin)
- **Medical Tables**: 
  - `medical_topics` (4 topics)
  - `learning_items` (160 items)
  - `test_questions` (120 questions)

### 7. **Troubleshooting**

#### Login Failed (401 Unauthorized)
- Use the demo credentials shown on login page
- Or use: `demo@example.com` / `demo123`

#### Backend Connection Error
- Verify backend is running on port 8000
- Check firewall isn't blocking port 8000
- Ensure PostgreSQL is running

#### Admin Panel Not Loading
- Make sure you're logged in with an admin account
- Clear browser cache and reload
- Check browser console for errors

### 8. **API Endpoints**

Base URL: `http://127.0.0.1:8000`

#### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/google-login` - Google OAuth login

#### Admin Operations (require JWT token)
- `GET /admin/stats` - Get dashboard statistics
- `GET /admin/users` - List all users
- `POST /admin/create-admin` - Create new admin
- `PUT /admin/users/{id}/make-admin` - Promote to admin
- `PUT /admin/users/{id}/remove-admin` - Remove admin status
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/topics` - List topics
- `POST /admin/topics` - Create topic
- `DELETE /admin/topics/{id}` - Delete topic
- `GET /admin/learning-items` - List learning items
- `POST /admin/learning-items` - Create learning item
- `GET /admin/questions` - List questions
- `POST /admin/questions` - Create question

### 9. **Features Checklist**

- ✅ User authentication (email/password + Google OAuth)
- ✅ Admin dashboard with real database statistics
- ✅ User management (create, promote, demote, delete)
- ✅ Content management (topics, learning items, questions)
- ✅ Real-time updates without page refresh
- ✅ Error handling with user-friendly messages
- ✅ JWT token-based authorization
- ✅ Bcrypt password hashing
- ✅ CORS enabled for development
- ✅ PostgreSQL database integration

### 10. **Project Structure**

```
mebhub/
├── src/                          # React frontend
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login with demo credentials
│   │   ├── AdminDashboard.tsx   # Real database statistics
│   │   ├── AdminAuthentication.tsx  # User management
│   │   └── AdminTestAdd.tsx     # Content management
│   └── utils/
│       └── authService.ts       # API calls
├── Uzgame/                       # FastAPI backend
│   ├── app/
│   │   ├── main.py              # FastAPI app setup
│   │   ├── auth/                # Authentication logic
│   │   ├── routers/
│   │   │   ├── auth.py          # Auth endpoints
│   │   │   └── admin.py         # Admin endpoints
│   │   └── models/              # Database models
│   └── requirements.txt          # Python dependencies
├── ADMIN_GUIDE.md               # Detailed admin guide
└── QUICKSTART.md                # This file
```

---

**Last Updated**: March 30, 2026
**Status**: ✅ Production Ready
**Repository**: https://github.com/jonibekjorayev733-coder/Mebhub
