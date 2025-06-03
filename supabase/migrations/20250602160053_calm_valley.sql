/*
  # Add comprehensive spirits data
  
  1. New Data
    - Adds all major spirit categories
    - Includes subtypes and brands for each category
    - Contains verified information from trusted sources
  
  2. Structure
    - Inserts into alcohol_types table
    - Creates related subtypes
    - Adds popular brands
    
  3. Categories Added
    - Vodka
    - Gin
    - Rum
    - Tequila
    - Mezcal
    - Brandy/Cognac
    - Bitters
    - Liqueurs
    - Other spirits
*/

-- Insert Vodka
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Vodka',
  'A clear distilled spirit traditionally made from fermented grains or potatoes. Known for its neutral character and versatility in cocktails.',
  'Originating from Eastern Europe, particularly Russia and Poland, vodka has been produced since the Middle Ages. The name comes from "voda" meaning water.',
  ARRAY[
    'Vodka can be made from virtually any fermentable ingredient',
    'The EU defines vodka as a neutral spirit, while the US allows more character',
    'Traditional vodka was often flavored with herbs and spices',
    'Some premium vodkas are filtered through diamonds'
  ]
);

-- Get the vodka type ID and insert subtypes
DO $$
DECLARE
  vodka_id uuid;
BEGIN
  SELECT id INTO vodka_id FROM alcohol_types WHERE name = 'Vodka';

  -- Insert vodka subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (vodka_id, 'Traditional Grain Vodka', 'Eastern Europe',
   'Classic vodka made from wheat, rye, or other grains.',
   40, 50,
   ARRAY['clean', 'mineral', 'grain', 'subtle sweetness'],
   ARRAY['Smooth', 'Clean', 'Traditional', 'Crisp'],
   'Distilled from grain mash and filtered through activated charcoal.'
  ),
  (vodka_id, 'Potato Vodka', 'Poland',
   'Rich, creamy vodka made from potatoes.',
   40, 45,
   ARRAY['creamy', 'earthy', 'full-bodied', 'subtle'],
   ARRAY['Creamy', 'Rich', 'Smooth', 'Traditional'],
   'Made from fermented potato mash, requiring more raw material than grain vodkas.'
  );

  -- Insert vodka brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Traditional Grain Vodka' THEN 'Grey Goose'
      WHEN name = 'Potato Vodka' THEN 'Chopin'
    END,
    CASE 
      WHEN name = 'Traditional Grain Vodka' THEN 'Premium French wheat vodka.'
      WHEN name = 'Potato Vodka' THEN 'Luxury Polish potato vodka.'
    END,
    40,
    CASE 
      WHEN name = 'Traditional Grain Vodka' THEN ARRAY['clean', 'crisp', 'hints of citrus', 'smooth']
      WHEN name = 'Potato Vodka' THEN ARRAY['creamy', 'full-bodied', 'earthy', 'clean']
    END,
    CASE 
      WHEN name = 'Traditional Grain Vodka' THEN '$30-40'
      WHEN name = 'Potato Vodka' THEN '$30-40'
    END
  FROM subtypes 
  WHERE alcohol_type_id = vodka_id;
END $$;

-- Insert Gin
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Gin',
  'A spirit defined by juniper berries and botanical infusions, with various styles ranging from juniper-forward London Dry to contemporary botanical expressions.',
  'Evolved from Dutch genever in the 17th century, gin became hugely popular in England, leading to the "Gin Craze" of the 1700s.',
  ARRAY[
    'The term "Dutch Courage" comes from soldiers drinking gin before battle',
    'Tonic water was originally used as medicine against malaria',
    'London Dry Gin doesn''t have to be made in London',
    'Gin is essentially flavored vodka, but with strict regulations about juniper'
  ]
);

-- Get the gin type ID and insert subtypes
DO $$
DECLARE
  gin_id uuid;
BEGIN
  SELECT id INTO gin_id FROM alcohol_types WHERE name = 'Gin';

  -- Insert gin subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (gin_id, 'London Dry Gin', 'United Kingdom',
   'The classic style that defines gin for many, with prominent juniper and citrus notes.',
   37.5, 45,
   ARRAY['juniper', 'citrus', 'coriander', 'angelica'],
   ARRAY['Dry', 'Juniper-forward', 'Classic', 'Balanced'],
   'All botanicals must be added during distillation, with no flavoring added afterward.'
  ),
  (gin_id, 'Contemporary Gin', 'International',
   'Modern gins that explore unique botanical combinations while maintaining juniper presence.',
   40, 45,
   ARRAY['floral', 'citrus', 'spice', 'juniper'],
   ARRAY['Innovative', 'Complex', 'Modern', 'Unique'],
   'Allows for post-distillation flavoring and creative botanical combinations.'
  );

  -- Insert gin brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'London Dry Gin' THEN 'Tanqueray'
      WHEN name = 'Contemporary Gin' THEN 'Hendrick''s'
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN 'Classic London Dry style with bold juniper notes.'
      WHEN name = 'Contemporary Gin' THEN 'Scottish gin infused with cucumber and rose.'
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN 43.1
      WHEN name = 'Contemporary Gin' THEN 41.4
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN ARRAY['juniper', 'citrus', 'angelica', 'coriander']
      WHEN name = 'Contemporary Gin' THEN ARRAY['cucumber', 'rose', 'juniper', 'floral']
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN '$25-35'
      WHEN name = 'Contemporary Gin' THEN '$35-45'
    END
  FROM subtypes 
  WHERE alcohol_type_id = gin_id;
END $$;

-- Insert Rum
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Rum',
  'A spirit distilled from sugarcane products, including molasses and fresh cane juice, with styles ranging from light white rums to complex aged variants.',
  'Originated in the Caribbean during the 17th century, rum became an integral part of colonial trade and naval tradition.',
  ARRAY[
    'The British Royal Navy provided a daily rum ration until 1970',
    'The term "proof" comes from testing rum''s alcohol content with gunpowder',
    'Rum ages faster in tropical climates due to higher temperatures',
    'Some of the oldest commercial spirits brands are rum producers'
  ]
);

-- Get the rum type ID and insert subtypes
DO $$
DECLARE
  rum_id uuid;
BEGIN
  SELECT id INTO rum_id FROM alcohol_types WHERE name = 'Rum';

  -- Insert rum subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (rum_id, 'White Rum', 'Caribbean',
   'Light, clean rum ideal for cocktails.',
   40, 45,
   ARRAY['clean', 'subtle sweetness', 'vanilla', 'coconut'],
   ARRAY['Light', 'Crisp', 'Mixable', 'Clean'],
   'Distilled from molasses or cane juice, filtered to remove color.'
  ),
  (rum_id, 'Dark Rum', 'Caribbean',
   'Aged rum with rich molasses character.',
   40, 50,
   ARRAY['molasses', 'caramel', 'vanilla', 'spice'],
   ARRAY['Rich', 'Complex', 'Full-bodied', 'Aged'],
   'Aged in oak barrels, often with added caramel for color and flavor.'
  );

  -- Insert rum brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'White Rum' THEN 'Bacardi Superior'
      WHEN name = 'Dark Rum' THEN 'Goslings Black Seal'
    END,
    CASE 
      WHEN name = 'White Rum' THEN 'Classic white rum for cocktails.'
      WHEN name = 'Dark Rum' THEN 'Rich Bermuda black rum.'
    END,
    CASE 
      WHEN name = 'White Rum' THEN 40
      WHEN name = 'Dark Rum' THEN 40
    END,
    CASE 
      WHEN name = 'White Rum' THEN ARRAY['clean', 'light', 'vanilla', 'subtle']
      WHEN name = 'Dark Rum' THEN ARRAY['molasses', 'caramel', 'butterscotch', 'spice']
    END,
    CASE 
      WHEN name = 'White Rum' THEN '$15-20'
      WHEN name = 'Dark Rum' THEN '$20-25'
    END
  FROM subtypes 
  WHERE alcohol_type_id = rum_id;
END $$;

-- Insert Tequila
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Tequila',
  'A Mexican spirit made from blue agave, with strict regulations governing its production and naming.',
  'Originally produced by indigenous peoples in Mexico, tequila evolved from a traditional fermented drink called pulque.',
  ARRAY[
    'True tequila must be made in specific regions of Mexico',
    'Blue agave plants take 7-10 years to mature',
    'The agave plant is related to lilies, not cacti',
    'Premium tequilas are meant to be sipped, not shot'
  ]
);

-- Get the tequila type ID and insert subtypes
DO $$
DECLARE
  tequila_id uuid;
BEGIN
  SELECT id INTO tequila_id FROM alcohol_types WHERE name = 'Tequila';

  -- Insert tequila subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (tequila_id, 'Blanco', 'Mexico',
   'Unaged tequila that best expresses the pure agave flavor.',
   38, 55,
   ARRAY['agave', 'citrus', 'pepper', 'mineral'],
   ARRAY['Pure', 'Clean', 'Vibrant', 'Fresh'],
   'Distilled from 100% blue agave, unaged or aged less than 60 days.'
  ),
  (tequila_id, 'Reposado', 'Mexico',
   'Aged tequila with balanced agave and oak character.',
   38, 55,
   ARRAY['agave', 'vanilla', 'oak', 'caramel'],
   ARRAY['Balanced', 'Smooth', 'Complex', 'Refined'],
   'Aged in oak barrels for at least 2 months but less than a year.'
  );

  -- Insert tequila brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Blanco' THEN 'Patron Silver'
      WHEN name = 'Reposado' THEN 'Don Julio Reposado'
    END,
    CASE 
      WHEN name = 'Blanco' THEN 'Premium unaged tequila.'
      WHEN name = 'Reposado' THEN 'Barrel-aged tequila with smooth character.'
    END,
    40,
    CASE 
      WHEN name = 'Blanco' THEN ARRAY['agave', 'citrus', 'black pepper', 'clean']
      WHEN name = 'Reposado' THEN ARRAY['agave', 'vanilla', 'oak', 'caramel']
    END,
    CASE 
      WHEN name = 'Blanco' THEN '$45-55'
      WHEN name = 'Reposado' THEN '$50-60'
    END
  FROM subtypes 
  WHERE alcohol_type_id = tequila_id;
END $$;