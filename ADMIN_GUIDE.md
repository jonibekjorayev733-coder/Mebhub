# 🎯 Admin Panel - Complete Guide

## Login Credentials

Use these credentials to access the admin panel:

### Admin User
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Administrator (full access to admin panel)

### Test User
- **Email**: `test@example.com`
- **Password**: `admin123`
- **Role**: Administrator

## Admin Panel Features

### 1. 📊 Dashboard
**Location**: `/admin`

Shows real-time statistics from the database:
- **Total Topics**: Number of medical topics in the system (4)
- **Total Learning Items**: Number of learning items (160)
- **Total Test Questions**: Number of test questions (120)
- **Total Users**: Number of registered users (14+)

Updates automatically from the database via `/admin/stats` endpoint.

---

### 2. 🔐 Authentication & User Management
**Location**: `/admin/authentication`

#### View All Users
- See all registered users in a table
- Shows user status: **Admin** (🔐) or **User** (👤)
- Real-time updates every 2 seconds

#### Create New Admin
- Click "Yangi Admin" button
- Fill in:
  - **Email**: New admin's email address
  - **Password**: Strong password (max 72 characters due to bcrypt)
  - **Full Name**: Admin's full name
- Click "Saqlash" to create

#### Promote User to Admin
1. Find the user in the table
2. Click "Admin Qil" button (only appears for regular users)
3. Confirm the dialog: "Bu foydalanuvchini adminlikka ko'tarmoqchisiz?"
4. User is instantly promoted - status changes to Admin
5. They can now access the admin panel

#### Remove Admin Status
1. Find the admin in the table
2. Click "Admin Olib Tash" button (only appears for admins)
3. Confirm the dialog: "Bu foydalanuvchini adminlikdan olib tashlamoqchisiz?"
4. User is instantly demoted - status changes to User
5. They lose admin panel access

#### Delete User
1. Find the user in the table
2. Click the trash icon
3. Confirm deletion
4. User is removed from the system

---

### 3. 📚 Test Add - Content Management
**Location**: `/admin/test-add`

Manage all educational content with three tabs:

#### Mavzular (Topics)
- **View Topics**: See all medical topics in grid view
- **Add Topic**:
  - Click "Yangi Mavzu" button
  - Fill in Topic Name and Description
  - Click "Saqlash"
- **Delete Topic**: 
  - Click trash icon on topic card
  - Confirm deletion
  - Topic and all associated items are deleted

#### O'rganish (Learning Items)
- **View Items**: See all learning materials in table format
- **Add Learning Item**:
  - Click "Yangi Material" button
  - Select Topic (dropdown)
  - Enter Latin Term (e.g., "Skeletus")
  - Enter Uzbek Term (e.g., "Suyak Tuzilmasi")
  - Enter Description (optional)
  - Click "Saqlash"
- **Delete Item**: Click delete icon with confirmation

#### Savollar (Questions)
- **View Questions**: See all test questions in table format
- **Add Question**:
  - Click "Yangi Savol" button
  - Select Topic (dropdown)
  - Enter Question Text
  - Enter Correct Answer
  - Enter 3 Incorrect Answer Options
  - Select Difficulty Level (easy/medium/hard)
  - Click "Saqlash"
- **Delete Question**: Click delete icon with confirmation

---

## API Endpoints (Backend)

All endpoints require Bearer token authentication via JWT.

### Statistics
- `GET /admin/stats` - Get dashboard statistics

### User Management
- `GET /admin/users` - List all users
- `POST /admin/create-admin` - Create new admin
- `PUT /admin/users/{id}/make-admin` - Promote to admin
- `PUT /admin/users/{id}/remove-admin` - Remove admin status (NEW!)
- `DELETE /admin/users/{id}` - Delete user

### Topics
- `GET /admin/topics` - List all topics
- `POST /admin/topics` - Create topic
- `DELETE /admin/topics/{id}` - Delete topic

### Learning Items
- `GET /admin/learning-items` - List all learning items
- `POST /admin/learning-items` - Create learning item
- `POST /admin/items` - Create learning item (alias)

### Questions
- `GET /admin/questions` - List all questions
- `POST /admin/questions` - Create question

---

## Features

✅ **Real-time Updates**
- User list updates every 2 seconds
- Instant UI changes when promoting/demoting users
- No page refresh needed

✅ **Error Handling**
- Detailed error messages from API
- Console logs for debugging
- User-friendly alerts

✅ **Security**
- JWT token-based authentication
- Admin-only access to all endpoints
- Password truncation (bcrypt 72-byte limit)

✅ **User Experience**
- Confirmation dialogs for destructive actions
- Visual status indicators
- Dark theme with smooth transitions
- Mobile-responsive design

---

## Testing Workflow

1. **Login**: Use `admin@example.com` / `admin123`
2. **View Dashboard**: See real database statistics
3. **Go to Authentication**:
   - See list of all users
   - Create a new admin
   - Promote a user to admin
   - See them become admin instantly
   - Demote them back to user
4. **Go to Test Add**:
   - Add new topics
   - Add learning items for topics
   - Add test questions
   - See them appear instantly in lists

---

## Common Issues & Solutions

### Login Not Working
- **Problem**: "Email yoki parol noto'g'ri" error
- **Solution**: Use exact credentials: `admin@example.com` / `admin123`

### Backend Connection Error
- **Problem**: CORS error or "Failed to fetch"
- **Solution**: 
  - Ensure backend is running: `python -m uvicorn app.main:app --reload --port 8000`
  - Check firewall isn't blocking port 8000

### Form Submission Failed
- **Problem**: "Serverga ulanishda xato yuz berdi"
- **Solution**:
  - Check browser console for error details
  - Verify all required fields are filled
  - Check JWT token is valid

---

## Development

### Starting the Application

**Backend**:
```bash
cd Uzgame
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
npm run dev
```

### Database
- **Type**: PostgreSQL
- **Name**: `med`
- **Connection**: `postgresql://postgres:jonibek@127.0.0.1:5432/med`

### User Table Structure
- `id`: Primary key
- `email`: User email
- `hashed_password`: BCrypt hashed password (72-byte max)
- `full_name`: User's full name
- `is_admin`: Boolean flag for admin status
- `created_at`: Account creation timestamp

---

**Last Updated**: March 30, 2026
**Status**: ✅ Fully Functional
