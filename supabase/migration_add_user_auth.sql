-- Migration: Add user authentication and user_id columns

-- Add user_id to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to memos table
ALTER TABLE memos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS cards_user_id_idx ON cards(user_id);
CREATE INDEX IF NOT EXISTS memos_user_id_idx ON memos(user_id);

-- Drop old policies
DROP POLICY IF EXISTS "Enable read access for all users" ON cards;
DROP POLICY IF EXISTS "Enable insert access for all users" ON cards;
DROP POLICY IF EXISTS "Enable update access for all users" ON cards;
DROP POLICY IF EXISTS "Enable delete access for all users" ON cards;

DROP POLICY IF EXISTS "Enable read access for all users" ON memos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON memos;
DROP POLICY IF EXISTS "Enable update access for all users" ON memos;
DROP POLICY IF EXISTS "Enable delete access for all users" ON memos;

-- Create new RLS policies for cards (user-specific)
CREATE POLICY "Users can view their own cards"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- Create new RLS policies for memos (user-specific)
CREATE POLICY "Users can view their own memos"
  ON memos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memos"
  ON memos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memos"
  ON memos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memos"
  ON memos FOR DELETE
  USING (auth.uid() = user_id);

-- Columns table remains shared (no user_id needed)
-- Keep existing policies for columns table
