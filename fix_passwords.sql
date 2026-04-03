-- Fix password hashes in med table to match actual passwords
-- These hashes are generated using bcrypt round 12

-- Update admin@example.com password hash for 'admin123'
UPDATE public."med" 
SET hashed_password = '$2b$12$boaaUBlWs3xetIAG12qjHOfOcb2iFuLAvuQN.C7Ys5dF8RQPnsS6G'
WHERE email = 'admin@example.com';

-- Update test@example.com password hash for 'test123'
UPDATE public."med" 
SET hashed_password = '$2b$12$2Ym7nHsq577PT44p9JideO5isC5G7eV6wjJ73n3mPJKg4g2F6rVDO'
WHERE email = 'test@example.com';

-- Verify the update
SELECT email, hashed_password, is_admin, is_active FROM public."med" WHERE email IN ('admin@example.com', 'test@example.com');
