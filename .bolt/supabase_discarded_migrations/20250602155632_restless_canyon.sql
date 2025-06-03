/*
  # Add Gin Data
  
  1. New Data
    - Add gin category to alcohol_types
    - Add major gin styles to subtypes
    - Add notable gin brands
  
  2. Structure
    - Maintains existing schema
    - Links subtypes to parent gin type
    - Links brands to their respective subtypes
*/

-- Insert gin base type
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Gin',
  'A neutral spirit flavored with juniper berries and other botanicals. The predominant flavor must be juniper, but other common botanicals include coriander, citrus peel, angelica root, orris root, and many others.',
  'Gin evolved from the Dutch spirit genever in the 17th century. It gained massive popularity in England, particularly during the "Gin Craze" of the 18th century. The development of the column still in the 19th century enabled the production of lighter, purer spirits, leading to the London Dry style that dominates today.',
  ARRAY[
    'The term "Dutch Courage" comes from British soldiers drinking gin before battle during the Thirty Years War',
    'Tonic water was originally used as medicine against malaria, leading to the creation of the Gin & Tonic',
    'London Dry Gin doesn''t have to be made in London - it''s a production method, not a geographical indication',
    'The Philippines is the world''s largest gin market by volume'
  ]
);

-- Get the gin type ID and insert subtypes
DO $$
DECLARE
  gin_id uuid;
BEGIN
  SELECT id INTO gin_id FROM alcohol_types WHERE name = 'Gin';

  -- Insert subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (gin_id, 'London Dry Gin', 'Global',
   'The most common style of gin, characterized by its pure, juniper-forward profile with no artificial flavoring allowed.',
   37.5, 45,
   ARRAY['juniper', 'coriander', 'citrus peel', 'angelica root', 'orris root'],
   ARRAY['Dry', 'Juniper-forward', 'Clean', 'Crisp'],
   'All botanicals must be natural and added during distillation. No artificial flavoring or coloring allowed. Nothing can be added after distillation except water.'
  ),
  (gin_id, 'Plymouth Gin', 'Plymouth, England',
   'A protected geographical indication, slightly sweeter and earthier than London Dry.',
   41.2, 41.2,
   ARRAY['juniper', 'earthiness', 'citrus', 'cardamom', 'orris'],
   ARRAY['Smooth', 'Full-bodied', 'Earthy', 'Traditional'],
   'Can only be produced in Plymouth, England. Uses seven traditional botanicals and soft water from Dartmoor.'
  ),
  (gin_id, 'Contemporary Gin', 'Global',
   'Modern gins that push traditional boundaries while maintaining juniper as a key ingredient.',
   40, 45,
   ARRAY['juniper', 'unique botanicals', 'floral', 'citrus', 'spice'],
   ARRAY['Innovative', 'Complex', 'Unique', 'Modern'],
   'Uses traditional gin-making methods but incorporates unique or local botanicals. May focus on non-traditional flavor profiles while maintaining juniper presence.'
  ),
  (gin_id, 'Old Tom Gin', 'Global',
   'A slightly sweeter style of gin that bridges the gap between genever and London Dry.',
   40, 44,
   ARRAY['juniper', 'licorice', 'citrus', 'sweet spice'],
   ARRAY['Sweet', 'Rich', 'Complex', 'Historical'],
   'Traditional style that may be sweetened after distillation. Often uses a combination of pot and column distillation.'
  );

  -- Insert notable brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'London Dry Gin' THEN 'Tanqueray No. Ten'
      WHEN name = 'Plymouth Gin' THEN 'Plymouth Gin Original'
      WHEN name = 'Contemporary Gin' THEN 'Hendrick''s'
      WHEN name = 'Old Tom Gin' THEN 'Hayman''s Old Tom'
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN 'Premium small-batch gin distilled with fresh citrus fruits.'
      WHEN name = 'Plymouth Gin' THEN 'The original Plymouth Gin, made since 1793.'
      WHEN name = 'Contemporary Gin' THEN 'Scottish gin infused with cucumber and rose petals.'
      WHEN name = 'Old Tom Gin' THEN 'Traditional sweeter style gin based on historical recipe.'
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN 47.3
      WHEN name = 'Plymouth Gin' THEN 41.2
      WHEN name = 'Contemporary Gin' THEN 41.4
      WHEN name = 'Old Tom Gin' THEN 41.4
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN ARRAY['citrus', 'juniper', 'chamomile', 'white pepper']
      WHEN name = 'Plymouth Gin' THEN ARRAY['juniper', 'coriander', 'cardamom', 'citrus']
      WHEN name = 'Contemporary Gin' THEN ARRAY['cucumber', 'rose', 'juniper', 'citrus']
      WHEN name = 'Old Tom Gin' THEN ARRAY['licorice', 'orange', 'juniper', 'spice']
    END,
    CASE 
      WHEN name = 'London Dry Gin' THEN '$35-45'
      WHEN name = 'Plymouth Gin' THEN '$30-40'
      WHEN name = 'Contemporary Gin' THEN '$35-45'
      WHEN name = 'Old Tom Gin' THEN '$30-40'
    END
  FROM subtypes 
  WHERE alcohol_type_id = gin_id;
END $$;