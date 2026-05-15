ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt (pgcrypto). NULL si el usuario solo usa Google OAuth.';
