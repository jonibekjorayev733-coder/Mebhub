import sqlite3

# Connect to app.db
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Get current columns in med table
cursor.execute("PRAGMA table_info(med)")
columns = cursor.fetchall()

print('Current columns in med table:')
for col in columns:
    col_name = col[1]
    col_type = col[2]
    print(f'  - {col_name} ({col_type})')

# List of columns you want
wanted_columns = ['id', 'email', 'hashed_password', 'full_name']
existing_columns = [col[1] for col in columns]

print('\nColumns you want:')
for col in wanted_columns:
    status = '✓' if col in existing_columns else '✗ MISSING'
    print(f'  {status} {col}')

# Add missing columns
missing = []
for col in wanted_columns:
    if col not in existing_columns:
        missing.append(col)

if missing:
    print(f'\nMissing columns to add: {missing}')
else:
    print('\nAll columns already exist!')

conn.close()
