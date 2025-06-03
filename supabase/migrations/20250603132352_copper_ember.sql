/*
  # Fix spirit_id type in ratings table

  1. Changes
    - Change spirit_id column type from UUID to TEXT to match application IDs

  2. Security
    - Maintain existing RLS policies
    - No data loss - existing data will be preserved
*/

DO $$ BEGIN
  -- Change spirit_id column type from UUID to TEXT
  ALTER TABLE ratings 
  ALTER COLUMN spirit_id TYPE TEXT;
END $$;