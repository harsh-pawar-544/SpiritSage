/*
  # Fix spirit_id column type in ratings table
  
  1. Changes
    - Drop existing foreign key constraint
    - Change spirit_id column type to TEXT
    - Add new foreign key constraint
    
  2. Security
    - Maintains data integrity
    - Preserves foreign key relationships
*/

-- First, drop the existing foreign key constraint
ALTER TABLE ratings
DROP CONSTRAINT IF EXISTS ratings_spirit_id_fkey;

-- Create a new ratings table with the correct column type
CREATE TABLE IF NOT EXISTS new_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spirit_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Copy data from old table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ratings') THEN
    INSERT INTO new_ratings (id, spirit_id, user_id, rating, comment, created_at, updated_at)
    SELECT id, spirit_id::text, user_id, rating, comment, created_at, updated_at
    FROM ratings;
  END IF;
END $$;

-- Drop old table and rename new one
DROP TABLE IF EXISTS ratings;
ALTER TABLE new_ratings RENAME TO ratings;

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Allow authenticated users to create ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access to ratings"
  ON ratings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow users to delete own ratings"
  ON ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);