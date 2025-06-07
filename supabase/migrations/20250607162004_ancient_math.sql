/*
  # Add image_url columns to all spirit tables

  1. Changes
    - Add image_url column to alcohol_types table
    - Add image_url column to subtypes table  
    - Add image_url column to brands table

  2. Data
    - Add sample image URLs for existing data
*/

-- Add image_url columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alcohol_types' AND column_name = 'image_url') THEN
    ALTER TABLE alcohol_types ADD COLUMN image_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subtypes' AND column_name = 'image_url') THEN
    ALTER TABLE subtypes ADD COLUMN image_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brands' AND column_name = 'image_url') THEN
    ALTER TABLE brands ADD COLUMN image_url text;
  END IF;
END $$;

-- Update existing alcohol types with sample images
UPDATE alcohol_types SET image_url = 
  CASE name
    WHEN 'Whiskey' THEN 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg'
    WHEN 'Vodka' THEN 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg'
    WHEN 'Gin' THEN 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg'
    WHEN 'Rum' THEN 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg'
    WHEN 'Tequila' THEN 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg'
    WHEN 'Mezcal' THEN 'https://images.pexels.com/photos/8105037/pexels-photo-8105037.jpeg'
    WHEN 'Brandy' THEN 'https://images.pexels.com/photos/3858347/pexels-photo-3858347.jpeg'
    WHEN 'Cognac' THEN 'https://images.pexels.com/photos/6638087/pexels-photo-6638087.jpeg'
    WHEN 'Bitters' THEN 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg'
    WHEN 'Liqueurs' THEN 'https://images.pexels.com/photos/3407622/pexels-photo-3407622.jpeg'
    WHEN 'Absinthe' THEN 'https://images.pexels.com/photos/2531735/pexels-photo-2531735.jpeg'
    WHEN 'Soju' THEN 'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg'
    WHEN 'Shochu' THEN 'https://images.pexels.com/photos/6638642/pexels-photo-6638642.jpeg'
    WHEN 'Baijiu' THEN 'https://images.pexels.com/photos/6638905/pexels-photo-6638905.jpeg'
    WHEN 'Akvavit' THEN 'https://images.pexels.com/photos/5947552/pexels-photo-5947552.jpeg'
    WHEN 'Grappa' THEN 'https://images.pexels.com/photos/5947036/pexels-photo-5947036.jpeg'
    WHEN 'Vermouth' THEN 'https://images.pexels.com/photos/5947024/pexels-photo-5947024.jpeg'
    ELSE 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  END
WHERE image_url IS NULL;

-- Update existing subtypes with sample images
UPDATE subtypes SET image_url = 
  CASE 
    WHEN name LIKE '%Bourbon%' THEN 'https://images.pexels.com/photos/5947552/pexels-photo-5947552.jpeg'
    WHEN name LIKE '%Scotch%' THEN 'https://images.pexels.com/photos/6638905/pexels-photo-6638905.jpeg'
    WHEN name LIKE '%Japanese%' THEN 'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg'
    WHEN name LIKE '%Canadian%' THEN 'https://images.pexels.com/photos/6638642/pexels-photo-6638642.jpeg'
    WHEN name LIKE '%Gin%' THEN 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg'
    WHEN name LIKE '%Rum%' THEN 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg'
    WHEN name LIKE '%Tequila%' OR name LIKE '%Blanco%' OR name LIKE '%Reposado%' THEN 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg'
    WHEN name LIKE '%Vodka%' THEN 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg'
    ELSE 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  END
WHERE image_url IS NULL;

-- Update existing brands with sample images
UPDATE brands SET image_url = 
  CASE 
    WHEN name LIKE '%Buffalo%' OR name LIKE '%Bourbon%' THEN 'https://images.pexels.com/photos/5947552/pexels-photo-5947552.jpeg'
    WHEN name LIKE '%Macallan%' OR name LIKE '%Scotch%' THEN 'https://images.pexels.com/photos/6638905/pexels-photo-6638905.jpeg'
    WHEN name LIKE '%Yamazaki%' OR name LIKE '%Japanese%' THEN 'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg'
    WHEN name LIKE '%Crown%' OR name LIKE '%Canadian%' THEN 'https://images.pexels.com/photos/6638642/pexels-photo-6638642.jpeg'
    WHEN name LIKE '%Tanqueray%' OR name LIKE '%Hendrick%' OR name LIKE '%Gin%' THEN 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg'
    WHEN name LIKE '%Bacardi%' OR name LIKE '%Goslings%' OR name LIKE '%Rum%' THEN 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg'
    WHEN name LIKE '%Patron%' OR name LIKE '%Don Julio%' OR name LIKE '%Tequila%' THEN 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg'
    WHEN name LIKE '%Grey Goose%' OR name LIKE '%Chopin%' OR name LIKE '%Vodka%' THEN 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg'
    ELSE 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  END
WHERE image_url IS NULL;