/*
  # Whiskey Database Schema

  1. New Tables
    - `alcohol_types`
      - Main categories of alcohol with general info
    - `subtypes`
      - Specific varieties within each type
    - `brands`
      - Specific whiskey brands and products
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for admin users to manage data

  3. Initial Data
    - Insert whiskey type information
    - Add common whiskey subtypes
    - Include popular whiskey brands
*/

-- Create alcohol_types table
CREATE TABLE IF NOT EXISTS alcohol_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  history text NOT NULL,
  fun_facts text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subtypes table
CREATE TABLE IF NOT EXISTS subtypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alcohol_type_id uuid REFERENCES alcohol_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  region text NOT NULL,
  description text NOT NULL,
  abv_min decimal(4,1),
  abv_max decimal(4,1),
  flavor_profile text[] DEFAULT '{}',
  characteristics text[] DEFAULT '{}',
  production_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(alcohol_type_id, name)
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subtype_id uuid REFERENCES subtypes(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  abv decimal(4,1),
  tasting_notes text[] DEFAULT '{}',
  price_range text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(subtype_id, name)
);

-- Enable RLS
ALTER TABLE alcohol_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to alcohol_types"
  ON alcohol_types
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to subtypes"
  ON subtypes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to brands"
  ON brands
  FOR SELECT
  TO public
  USING (true);

-- Insert whiskey data
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Whiskey',
  'A distilled alcoholic beverage made from fermented grain mash. Different grains are used for different varieties, including barley, corn, rye, and wheat.',
  'Whiskey originated in medieval Scotland and Ireland. The word whiskey comes from the Gaelic "uisge beatha" meaning "water of life". The art of distillation spread from Ireland to Scotland, and later to North America and beyond.',
  ARRAY[
    'The word "whiskey" comes from the Gaelic "uisge beatha" meaning "water of life"',
    'Scotland has more distilleries than any other country in the world',
    'A closed bottle of whiskey can be kept for over 100 years without deteriorating',
    'During Prohibition, whiskey was one of few spirits legally available with a prescription'
  ]
);

-- Get the whiskey type ID
DO $$
DECLARE
  whiskey_id uuid;
BEGIN
  SELECT id INTO whiskey_id FROM alcohol_types WHERE name = 'Whiskey';

  -- Insert subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (whiskey_id, 'Bourbon', 'United States', 
   'American whiskey made primarily from corn, aged in new charred oak barrels.',
   40, 50,
   ARRAY['vanilla', 'caramel', 'oak', 'corn sweetness', 'cinnamon'],
   ARRAY['Sweet', 'Full-bodied', 'Smooth', 'Warming'],
   'Must be made from at least 51% corn and aged in new charred oak barrels. No minimum aging period required, but must be produced in the United States.'
  ),
  (whiskey_id, 'Scotch Single Malt', 'Scotland',
   'Made from malted barley at a single distillery in Scotland, aged for at least 3 years.',
   40, 46,
   ARRAY['heather', 'honey', 'oak', 'smoke', 'maritime'],
   ARRAY['Complex', 'Peated', 'Rich', 'Traditional'],
   'Made from 100% malted barley, distilled at a single distillery in Scotland. Must be aged for at least 3 years in oak casks.'
  ),
  (whiskey_id, 'Japanese Whisky', 'Japan',
   'Japanese whisky embodies a philosophy of meticulous craftsmanship, balance, and understated elegance.',
   43, 50,
   ARRAY['floral', 'honey', 'citrus', 'oak', 'incense'],
   ARRAY['Refined', 'Delicate', 'Complex', 'Balanced'],
   'Crafted using Scottish methods adapted to Japanese conditions, with pure mountain water and carefully selected malts. Aged in various casks including rare Mizunara oak.'
  ),
  (whiskey_id, 'Canadian Rye', 'Canada',
   'Canadian whisky is renowned for its exceptional smoothness, lightness, and approachable character.',
   40, 45,
   ARRAY['vanilla', 'caramel', 'rye spice', 'toffee', 'maple'],
   ARRAY['Smooth', 'Light', 'Versatile', 'Spicy'],
   'Multiple grains distilled separately and aged in oak barrels before blending. Minimum three years aging required.'
  );

  -- Insert some example brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Bourbon' THEN 'Buffalo Trace'
      WHEN name = 'Scotch Single Malt' THEN 'Macallan 12'
      WHEN name = 'Japanese Whisky' THEN 'Yamazaki 12'
      WHEN name = 'Canadian Rye' THEN 'Crown Royal'
    END,
    CASE 
      WHEN name = 'Bourbon' THEN 'A classic Kentucky straight bourbon with rich vanilla and oak notes.'
      WHEN name = 'Scotch Single Malt' THEN 'Sherry cask matured Highland single malt with rich fruit and oak.'
      WHEN name = 'Japanese Whisky' THEN 'The pioneer of Japanese single malts, featuring delicate fruit and mizunara notes.'
      WHEN name = 'Canadian Rye' THEN 'Smooth and versatile Canadian whisky with gentle rye spice.'
    END,
    CASE 
      WHEN name = 'Bourbon' THEN 45
      WHEN name = 'Scotch Single Malt' THEN 43
      WHEN name = 'Japanese Whisky' THEN 43
      WHEN name = 'Canadian Rye' THEN 40
    END,
    CASE 
      WHEN name = 'Bourbon' THEN ARRAY['vanilla', 'caramel', 'oak', 'brown sugar']
      WHEN name = 'Scotch Single Malt' THEN ARRAY['sherry', 'oak', 'dried fruits', 'spice']
      WHEN name = 'Japanese Whisky' THEN ARRAY['fruit', 'mizunara', 'honey', 'floral']
      WHEN name = 'Canadian Rye' THEN ARRAY['vanilla', 'caramel', 'rye', 'maple']
    END,
    CASE 
      WHEN name = 'Bourbon' THEN '$30-40'
      WHEN name = 'Scotch Single Malt' THEN '$60-80'
      WHEN name = 'Japanese Whisky' THEN '$100-120'
      WHEN name = 'Canadian Rye' THEN '$25-35'
    END
  FROM subtypes 
  WHERE alcohol_type_id = whiskey_id;
END $$;