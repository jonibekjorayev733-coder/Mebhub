# Backend Database Schema Fix

## Issues Found

### 1. React Component Hook Order Error (FIXED)
**File:** `src/pages/games/WordSearchGame.tsx`

**Problem:** The `useMemo` hook was being called conditionally inside the JSX, violating React's Rules of Hooks.

**Solution:** Moved all hooks and memoized computations to the top level of the component before any conditional returns. Now:
- All hooks are called unconditionally at the top level
- The `displayLetters` memoization is computed once, even if not in the "playing" phase
- Conditional rendering uses the pre-computed values

### 2. Backend Database Schema Mismatch (NEEDS FIX)
**File:** `Uzgame/app/models/game.py` and database

**Problem:** The database table `game_questions` doesn't have the required columns that are defined in the model. The error shows:
```
psycopg2.errors.UndefinedColumn: column game_questions.game_id does not exist
```

**Root Cause:** The database was created with an older schema that doesn't match the current model definition.

## How to Fix the Database

### Step 1: Navigate to the Uzgame directory
```powershell
cd Uzgame
```

### Step 2: Recreate the database tables
```powershell
python recreate_tables.py
```

This script will:
- Drop all existing tables (THIS WILL DELETE ALL DATA)
- Create new tables with the correct schema

### Step 3: Seed with sample data
```powershell
python seed_word_search.py
```

This script will:
- Add 10 sample word search questions to the database
- The questions are in Uzbek and cover different difficulty levels

## Detailed Schema for game_questions Table

The `GameQuestion` model defines these columns:

```python
id                  - INTEGER PRIMARY KEY
game_id             - STRING (e.g., "soz_qidiruv", "math", "physics")
stage_id            - INTEGER (checkpoint/stage number)
question_text       - TEXT (the question)
options             - JSON (array of answer options)
correct_answer      - INTEGER (index of correct answer: 0, 1, 2, 3)
difficulty          - STRING ("Oson", "O'rta", "Qiyin")
explanation         - TEXT (explanation of correct answer)
reward_type         - STRING (optional: "power", "stamina", "speed", "score")
reward_value        - FLOAT (default: 0)
penalty_type        - STRING (optional: "stamina_loss", "speed_reduction", "score_deduction")
penalty_value       - FLOAT (default: 0)
order_index         - INTEGER (for sorting, default: 0)
points              - INTEGER (points for correct answer, default: 1)
created_at          - DATETIME (timestamp)
```

## API Endpoint

**Endpoint:** `GET /games/questions/{game_name}`

**Parameters:**
- `game_name` (path) - e.g., "soz_qidiruv"
- `difficulty` (query) - "Oson", "O'rta", or "Qiyin" (default: "Oson")

**Example:**
```
GET http://localhost:8000/games/questions/soz_qidiruv?difficulty=Oson
```

**Response:**
```json
[
  {
    "id": 1,
    "q": "AMAKL so'zidan qaysi harfni olib tashlash kerak?",
    "opts": ["A", "M", "K", "L"],
    "correct": 1,
    "difficulty": "Oson",
    "explanation": "AMAKL → AKAL (to'g'ri so'z)",
    "points": 10
  },
  ...
]
```

## Changes Made to Code

### Frontend Changes:
1. **WordSearchGame.tsx** - Fixed React hook order
   - Moved `useMemo` to top level
   - Fixed dependency arrays for all `useEffect` hooks
   - Ensured all hooks are called unconditionally

### Backend Changes:
1. **games.py** - Removed reference to non-existent `section_number` field
   - Commented out the section filter logic
   - Router now works with the actual model schema

## Testing the Fix

### 1. Start the backend server:
```powershell
cd Uzgame
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Recreate the database:
```powershell
python recreate_tables.py
python seed_word_search.py
```

### 3. Test the API endpoint:
```powershell
curl "http://localhost:8000/games/questions/soz_qidiruv?difficulty=Oson"
```

Or open in browser:
```
http://localhost:8000/games/questions/soz_qidiruv?difficulty=Oson
```

### 4. Test the frontend:
In another terminal:
```powershell
cd ..
npm run dev
```

Navigate to the Word Search Game and it should now work without errors.

## Fallback Mechanism

The frontend has a built-in fallback:
- If the API returns an error or no data, it automatically uses mock questions
- This ensures the game works even if the database is empty
- All 10 mock questions are defined in the component

## Notes

- **IMPORTANT**: Running `recreate_tables.py` will DELETE all existing data. Make sure you have backups if needed.
- The seed script includes 10 sample questions at different difficulty levels
- You can add more questions manually to the database after creating the tables
- The seed script checks if data already exists and asks for confirmation before overwriting

## Troubleshooting

**Error: "column game_questions.game_id does not exist"**
→ Run `python recreate_tables.py` to recreate the tables

**Error: "No such table: game_questions"**
→ Run `python recreate_tables.py` to create the tables

**No data appears in the game**
→ Run `python seed_word_search.py` to add sample questions

**Frontend still shows "Savollar yuklanmoqda..."**
→ Check that the backend server is running on port 8000
→ Check browser console for network errors
→ The app will use mock questions if the API fails

