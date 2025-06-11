/*
  # Fix RLS policy for user_spirits table

  1. Security
    - Drop existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure users can only add spirits to their own collection
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can add spirits to their collection" ON user_spirits;

-- Create a new INSERT policy with the correct auth.uid() function
CREATE POLICY "Users can add spirits to their collection"
  ON user_spirits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also update other policies to use auth.uid() for consistency
DROP POLICY IF EXISTS "Users can remove spirits from their collection" ON user_spirits;
CREATE POLICY "Users can remove spirits from their collection"
  ON user_spirits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own spirit notes" ON user_spirits;
CREATE POLICY "Users can update their own spirit notes"
  ON user_spirits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own spirits" ON user_spirits;
CREATE POLICY "Users can view their own spirits"
  ON user_spirits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);