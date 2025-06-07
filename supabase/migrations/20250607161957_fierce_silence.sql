/*
  # Create user_spirits table for My Bar functionality

  1. New Tables
    - `user_spirits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `spirit_id` (text, references spirit IDs)
      - `spirit_type` (enum: alcohol_type, subtype, brand)
      - `notes` (text, optional user notes)
      - `added_at` (timestamp)

  2. Security
    - Enable RLS on `user_spirits` table
    - Add policies for authenticated users to manage their own spirits
*/

-- Create enum for spirit types
CREATE TYPE spirit_type_enum AS ENUM ('alcohol_type', 'subtype', 'brand');

-- Create user_spirits table
CREATE TABLE IF NOT EXISTS user_spirits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spirit_id text NOT NULL,
  spirit_type spirit_type_enum NOT NULL,
  notes text,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, spirit_id, spirit_type)
);

-- Enable RLS
ALTER TABLE user_spirits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own spirits"
  ON user_spirits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add spirits to their collection"
  ON user_spirits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spirit notes"
  ON user_spirits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove spirits from their collection"
  ON user_spirits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_spirits_user_id ON user_spirits(user_id);
CREATE INDEX idx_user_spirits_spirit_id ON user_spirits(spirit_id);