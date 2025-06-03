/*
  # Create ratings table and related functions

  1. New Tables
    - `ratings`
      - `id` (uuid, primary key)
      - `spirit_id` (uuid, references spirit_subtypes)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `ratings` table
    - Add policies for:
      - Public read access
      - Authenticated users can create ratings
      - Users can update/delete their own ratings
*/

CREATE TABLE IF NOT EXISTS public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spirit_id uuid REFERENCES public.subtypes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to ratings"
  ON public.ratings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create ratings
CREATE POLICY "Allow authenticated users to create ratings"
  ON public.ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own ratings
CREATE POLICY "Allow users to update own ratings"
  ON public.ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own ratings
CREATE POLICY "Allow users to delete own ratings"
  ON public.ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);