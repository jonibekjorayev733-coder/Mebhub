-- Migration: Add role column to users table and create teacher_messages table
-- Run this SQL in your PostgreSQL database

-- Step 1: Add role column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(10) DEFAULT 'student' NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Step 2: Create teacher_messages table
CREATE TABLE IF NOT EXISTS teacher_messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0 NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Step 3: Create indexes for teacher_messages
CREATE INDEX IF NOT EXISTS idx_teacher_msg_sender ON teacher_messages (sender_id);

CREATE INDEX IF NOT EXISTS idx_teacher_msg_receiver ON teacher_messages (receiver_id);

CREATE INDEX IF NOT EXISTS idx_teacher_msg_read ON teacher_messages (is_read);

CREATE INDEX IF NOT EXISTS idx_teacher_msg_conversation ON teacher_messages (sender_id, receiver_id);

CREATE INDEX IF NOT EXISTS idx_teacher_msg_timestamp ON teacher_messages (timestamp);

-- Step 4: (Optional) Create a teacher user for testing
-- UPDATE users SET role = 'teacher' WHERE email = 'teacher@example.com';