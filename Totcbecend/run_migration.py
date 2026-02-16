"""
Run database migration to add role and teacher_messages table
"""
import sys
import os
sys.path.append(os.getcwd())

from app.database import engine
from sqlalchemy import text

migration_sql = """
-- Step 1: Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(10) DEFAULT 'student' NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Step 2: Create teacher_messages table
CREATE TABLE IF NOT EXISTS teacher_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create indexes for teacher_messages
CREATE INDEX IF NOT EXISTS idx_teacher_msg_sender ON teacher_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_teacher_msg_receiver ON teacher_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_teacher_msg_read ON teacher_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_teacher_msg_conversation ON teacher_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_teacher_msg_timestamp ON teacher_messages(timestamp);
"""

try:
    with engine.begin() as conn:
        # Split by semicolon and execute each statement
        statements = [s.strip() for s in migration_sql.split(';') if s.strip()]
        for statement in statements:
            print(f"Executing: {statement[:50]}...")
            conn.execute(text(statement))
    
    print("\n✅ Migration completed successfully!")
    print("✅ Added 'role' column to users table")
    print("✅ Created 'teacher_messages' table")
    
except Exception as e:
    print(f"\n❌ Migration failed: {e}")
    import traceback
    traceback.print_exc()
