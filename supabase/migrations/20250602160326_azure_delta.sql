-- Insert Mezcal
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Mezcal',
  'A traditional Mexican spirit made from various species of agave, known for its distinctive smoky character.',
  'Mezcal predates tequila and has been produced for centuries using traditional methods. The name comes from Nahuatl "mexcalli" meaning "oven-cooked agave".',
  ARRAY[
    'Unlike tequila, mezcal can be made from many different agave species',
    'The smoky flavor comes from roasting agave hearts in underground pits',
    'Traditional mezcal production often involves horse-powered stone mills',
    'The worm in mezcal bottles was originally a marketing gimmick'
  ]
);

-- Get the mezcal type ID and insert subtypes
DO $$
DECLARE
  mezcal_id uuid;
BEGIN
  SELECT id INTO mezcal_id FROM alcohol_types WHERE name = 'Mezcal';

  -- Insert mezcal subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (mezcal_id, 'Espadín', 'Oaxaca, Mexico',
   'Made from the most common agave variety used in mezcal production.',
   40, 55,
   ARRAY['smoke', 'earth', 'mineral', 'citrus'],
   ARRAY['Smoky', 'Complex', 'Traditional', 'Bold'],
   'Made from Agave angustifolia, roasted in underground pits and crushed using traditional methods.'
  ),
  (mezcal_id, 'Tobalá', 'Mexico',
   'A rare, wild-harvested agave variety producing complex mezcal.',
   45, 55,
   ARRAY['floral', 'fruity', 'mineral', 'smoke'],
   ARRAY['Delicate', 'Complex', 'Rare', 'Refined'],
   'Made from wild Agave potatorum, traditionally harvested and processed.'
  );

  -- Insert mezcal brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Espadín' THEN 'Del Maguey Vida'
      WHEN name = 'Tobalá' THEN 'El Jolgorio Tobalá'
    END,
    CASE 
      WHEN name = 'Espadín' THEN 'Artisanal espadín mezcal.'
      WHEN name = 'Tobalá' THEN 'Premium wild tobalá mezcal.'
    END,
    CASE 
      WHEN name = 'Espadín' THEN 42
      WHEN name = 'Tobalá' THEN 47
    END,
    CASE 
      WHEN name = 'Espadín' THEN ARRAY['smoke', 'citrus', 'earth', 'tropical fruit']
      WHEN name = 'Tobalá' THEN ARRAY['floral', 'mineral', 'fruit', 'subtle smoke']
    END,
    CASE 
      WHEN name = 'Espadín' THEN '$35-45'
      WHEN name = 'Tobalá' THEN '$120-150'
    END
  FROM subtypes 
  WHERE alcohol_type_id = mezcal_id;
END $$;

-- Insert Brandy
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Brandy',
  'A spirit distilled from wine or fermented fruit juice, aged in wooden casks.',
  'The term brandy comes from the Dutch word "brandewijn" meaning "burnt wine". It originated in the 16th century when wine merchants began distilling wine for transport.',
  ARRAY[
    'The term VS, VSOP, and XO indicate minimum aging periods',
    'Brandy snifters are designed to warm the spirit with hand heat',
    'Some of the oldest recorded spirits are brandies',
    'Brandy was originally created as a way to reduce wine for transport'
  ]
);

-- Get the brandy type ID and insert subtypes
DO $$
DECLARE
  brandy_id uuid;
BEGIN
  SELECT id INTO brandy_id FROM alcohol_types WHERE name = 'Brandy';

  -- Insert brandy subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (brandy_id, 'Spanish Brandy', 'Spain',
   'Brandy produced in Spain using the solera system.',
   36, 40,
   ARRAY['dried fruit', 'oak', 'vanilla', 'nuts'],
   ARRAY['Smooth', 'Rich', 'Complex', 'Warm'],
   'Aged using the solera system, blending different ages of brandy.'
  ),
  (brandy_id, 'American Brandy', 'United States',
   'Brandy produced primarily in California from local wine.',
   40, 45,
   ARRAY['grape', 'vanilla', 'caramel', 'oak'],
   ARRAY['Fresh', 'Fruity', 'Approachable', 'Clean'],
   'Distilled from wine and aged in oak barrels.'
  );

  -- Insert brandy brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Spanish Brandy' THEN 'Cardenal Mendoza'
      WHEN name = 'American Brandy' THEN 'E&J VSOP'
    END,
    CASE 
      WHEN name = 'Spanish Brandy' THEN 'Premium Spanish brandy aged in sherry casks.'
      WHEN name = 'American Brandy' THEN 'Popular American brandy aged in oak.'
    END,
    CASE 
      WHEN name = 'Spanish Brandy' THEN 40
      WHEN name = 'American Brandy' THEN 40
    END,
    CASE 
      WHEN name = 'Spanish Brandy' THEN ARRAY['dried fruit', 'oak', 'sherry', 'nuts']
      WHEN name = 'American Brandy' THEN ARRAY['vanilla', 'caramel', 'grape', 'oak']
    END,
    CASE 
      WHEN name = 'Spanish Brandy' THEN '$45-55'
      WHEN name = 'American Brandy' THEN '$15-20'
    END
  FROM subtypes 
  WHERE alcohol_type_id = brandy_id;
END $$;

-- Insert Cognac
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Cognac',
  'A specific type of brandy produced in the Cognac region of France under strict regulations.',
  'Cognac production began in the 16th century when Dutch merchants sought to preserve wine through distillation. The region''s unique soil and climate create distinctive characteristics.',
  ARRAY[
    'Cognac must be made in the Cognac region of France',
    'VS means the youngest brandy is aged at least 2 years',
    'XO Cognacs must be aged at least 10 years',
    'The region is divided into six growing areas, with Grande Champagne considered the finest'
  ]
);

-- Get the cognac type ID and insert subtypes
DO $$
DECLARE
  cognac_id uuid;
BEGIN
  SELECT id INTO cognac_id FROM alcohol_types WHERE name = 'Cognac';

  -- Insert cognac subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (cognac_id, 'VS Cognac', 'Cognac, France',
   'Very Special Cognac, aged for at least two years.',
   40, 42,
   ARRAY['grape', 'vanilla', 'oak', 'fruit'],
   ARRAY['Young', 'Fresh', 'Vibrant', 'Mixable'],
   'Double-distilled in copper pot stills and aged in French oak for minimum 2 years.'
  ),
  (cognac_id, 'XO Cognac', 'Cognac, France',
   'Extra Old Cognac, aged for at least 10 years.',
   40, 45,
   ARRAY['dried fruit', 'spice', 'leather', 'chocolate'],
   ARRAY['Complex', 'Rich', 'Mature', 'Refined'],
   'Double-distilled and aged in French oak for minimum 10 years.'
  );

  -- Insert cognac brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'VS Cognac' THEN 'Hennessy VS'
      WHEN name = 'XO Cognac' THEN 'Rémy Martin XO'
    END,
    CASE 
      WHEN name = 'VS Cognac' THEN 'Classic VS cognac, perfect for mixing.'
      WHEN name = 'XO Cognac' THEN 'Premium XO cognac for sipping.'
    END,
    40,
    CASE 
      WHEN name = 'VS Cognac' THEN ARRAY['vanilla', 'grape', 'oak', 'fresh fruit']
      WHEN name = 'XO Cognac' THEN ARRAY['dried fruit', 'chocolate', 'spice', 'leather']
    END,
    CASE 
      WHEN name = 'VS Cognac' THEN '$35-45'
      WHEN name = 'XO Cognac' THEN '$200-250'
    END
  FROM subtypes 
  WHERE alcohol_type_id = cognac_id;
END $$;

-- Insert Bitters
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Bitters',
  'Concentrated alcoholic mixtures flavored with botanical ingredients, used as flavor enhancers in cocktails.',
  'Originally developed as patent medicines in the 1700s, bitters evolved into essential cocktail ingredients. They were crucial to the first cocktail recipes.',
  ARRAY[
    'Angostura bitters were originally created as a medicine',
    'Many classic cocktails were created as vehicles for bitters',
    'Some bitters recipes remain closely guarded secrets',
    'Bitters were considered medicinal during US Prohibition'
  ]
);

-- Get the bitters type ID and insert subtypes
DO $$
DECLARE
  bitters_id uuid;
BEGIN
  SELECT id INTO bitters_id FROM alcohol_types WHERE name = 'Bitters';

  -- Insert bitters subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (bitters_id, 'Aromatic Bitters', 'International',
   'Traditional style of bitters with complex spice and herb profiles.',
   35, 45,
   ARRAY['spice', 'herbs', 'gentian', 'bark'],
   ARRAY['Complex', 'Aromatic', 'Balanced', 'Traditional'],
   'Herbs, spices, and botanicals are macerated in high-proof alcohol.'
  ),
  (bitters_id, 'Citrus Bitters', 'International',
   'Bitters focused on citrus flavors and aromatics.',
   35, 45,
   ARRAY['orange', 'lemon', 'spice', 'floral'],
   ARRAY['Bright', 'Fresh', 'Citrusy', 'Zesty'],
   'Citrus peels and complementary botanicals macerated in alcohol.'
  );

  -- Insert bitters brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Aromatic Bitters' THEN 'Angostura Aromatic'
      WHEN name = 'Citrus Bitters' THEN 'Regans'' Orange Bitters'
    END,
    CASE 
      WHEN name = 'Aromatic Bitters' THEN 'Classic aromatic bitters, essential for many cocktails.'
      WHEN name = 'Citrus Bitters' THEN 'Orange-forward bitters perfect for cocktails.'
    END,
    44.7,
    CASE 
      WHEN name = 'Aromatic Bitters' THEN ARRAY['gentian', 'spice', 'herbs', 'complex']
      WHEN name = 'Citrus Bitters' THEN ARRAY['orange', 'cardamom', 'citrus', 'spice']
    END,
    CASE 
      WHEN name = 'Aromatic Bitters' THEN '$8-12'
      WHEN name = 'Citrus Bitters' THEN '$8-12'
    END
  FROM subtypes 
  WHERE alcohol_type_id = bitters_id;
END $$;

-- Insert Liqueurs
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Liqueurs',
  'Sweetened spirits flavored with fruits, herbs, nuts, spices, or cream.',
  'Liqueurs evolved from medieval herbal medicines. Monks were often responsible for developing and preserving liqueur recipes.',
  ARRAY[
    'Many liqueur recipes were originally medicinal',
    'The term "cordial" is often used interchangeably with liqueur',
    'Some liqueur recipes are centuries old and closely guarded',
    'Liqueurs were often created in monasteries'
  ]
);

-- Get the liqueurs type ID and insert subtypes
DO $$
DECLARE
  liqueurs_id uuid;
BEGIN
  SELECT id INTO liqueurs_id FROM alcohol_types WHERE name = 'Liqueurs';

  -- Insert liqueur subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (liqueurs_id, 'Herbal Liqueur', 'International',
   'Complex liqueurs made from herbs and spices.',
   20, 40,
   ARRAY['herbs', 'spices', 'complex', 'botanical'],
   ARRAY['Complex', 'Herbal', 'Traditional', 'Unique'],
   'Herbs and spices are macerated in spirit, then sweetened.'
  ),
  (liqueurs_id, 'Fruit Liqueur', 'International',
   'Sweet liqueurs made from fruits or berries.',
   15, 30,
   ARRAY['fruit', 'sweet', 'fresh', 'bright'],
   ARRAY['Sweet', 'Fruity', 'Fresh', 'Vibrant'],
   'Fruit is macerated in spirit or fruit juice is added to spirit base.'
  );

  -- Insert liqueur brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Herbal Liqueur' THEN 'Green Chartreuse'
      WHEN name = 'Fruit Liqueur' THEN 'Cointreau'
    END,
    CASE 
      WHEN name = 'Herbal Liqueur' THEN 'Complex French herbal liqueur made by Carthusian monks.'
      WHEN name = 'Fruit Liqueur' THEN 'Premium orange liqueur essential for cocktails.'
    END,
    CASE 
      WHEN name = 'Herbal Liqueur' THEN 55
      WHEN name = 'Fruit Liqueur' THEN 40
    END,
    CASE 
      WHEN name = 'Herbal Liqueur' THEN ARRAY['herbs', 'spice', 'complex', 'botanical']
      WHEN name = 'Fruit Liqueur' THEN ARRAY['orange', 'sweet', 'clean', 'balanced']
    END,
    CASE 
      WHEN name = 'Herbal Liqueur' THEN '$60-70'
      WHEN name = 'Fruit Liqueur' THEN '$35-45'
    END
  FROM subtypes 
  WHERE alcohol_type_id = liqueurs_id;
END $$;

-- Insert Absinthe
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Absinthe',
  'A highly alcoholic spirit flavored primarily with green anise, sweet fennel, and wormwood.',
  'Originated in Switzerland, gained popularity in France, particularly among artists and writers. Banned in many countries in early 1900s, but has seen a revival.',
  ARRAY[
    'The traditional serving ritual involves slowly dripping water over a sugar cube',
    'Absinthe doesn''t actually cause hallucinations',
    'The green color comes from chlorophyll in herbs',
    'It was known as "The Green Fairy" in its heyday'
  ]
);

-- Get the absinthe type ID and insert subtypes
DO $$
DECLARE
  absinthe_id uuid;
BEGIN
  SELECT id INTO absinthe_id FROM alcohol_types WHERE name = 'Absinthe';

  -- Insert absinthe subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (absinthe_id, 'Verte', 'France/Switzerland',
   'Traditional green absinthe with complex herbal character.',
   45, 74,
   ARRAY['anise', 'wormwood', 'fennel', 'herbs'],
   ARRAY['Complex', 'Herbal', 'Traditional', 'Strong'],
   'Herbs are macerated after distillation to impart green color and additional flavor.'
  ),
  (absinthe_id, 'Blanche', 'France/Switzerland',
   'Clear absinthe without the final herb infusion.',
   45, 74,
   ARRAY['anise', 'wormwood', 'fennel', 'clean'],
   ARRAY['Clean', 'Crisp', 'Pure', 'Strong'],
   'Distilled but not subjected to final herbal coloring step.'
  );

  -- Insert absinthe brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Verte' THEN 'St. George Verte'
      WHEN name = 'Blanche' THEN 'La Clandestine'
    END,
    CASE 
      WHEN name = 'Verte' THEN 'American-made traditional-style green absinthe.'
      WHEN name = 'Blanche' THEN 'Swiss-made clear absinthe.'
    END,
    CASE 
      WHEN name = 'Verte' THEN 60
      WHEN name = 'Blanche' THEN 53
    END,
    CASE 
      WHEN name = 'Verte' THEN ARRAY['anise', 'wormwood', 'herbs', 'complex']
      WHEN name = 'Blanche' THEN ARRAY['anise', 'fennel', 'clean', 'herbs']
    END,
    CASE 
      WHEN name = 'Verte' THEN '$60-70'
      WHEN name = 'Blanche' THEN '$70-80'
    END
  FROM subtypes 
  WHERE alcohol_type_id = absinthe_id;
END $$;

-- Insert Asian Spirits (Soju, Shochu, Baijiu)
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES
  ('Soju',
   'A clear, neutral-tasting Korean spirit traditionally made from rice.',
   'Originally made from rice, soju production methods changed during the Korean War when rice was scarce. Modern soju can be made from various starches.',
   ARRAY[
     'Soju is the most popular spirit in the world by volume',
     'Traditional soju is still made only from rice',
     'Modern soju often has a lower ABV than traditional versions',
     'It''s often called "Korean vodka" but has a distinct character'
   ]
  ),
  ('Shochu',
   'A Japanese distilled spirit made from various base ingredients including sweet potato, barley, or rice.',
   'Dating back to the 16th century, shochu originated in Kyushu, Japan. Each region developed its own preferred base ingredients and styles.',
   ARRAY[
     'Shochu can be made from over 50 different base ingredients',
     'Some shochu is aged in clay pots buried underground',
     'Premium shochu is usually distilled only once',
     'It''s often confused with sake but is a distilled spirit'
   ]
  ),
  ('Baijiu',
   'Chinese grain spirit made through a unique solid-state fermentation process.',
   'With over 5000 years of history, baijiu is the world''s oldest known distilled spirit. Different regions developed distinct styles using local ingredients and techniques.',
   ARRAY[
     'Baijiu is the world''s most consumed spirit by volume',
     'The fermentation process uses a unique starter culture called Qu',
     'Some premium baijiu can cost thousands of dollars per bottle',
     'There are 12 distinct aroma categories of baijiu'
   ]
  );

-- Insert subtypes for Asian spirits
DO $$
DECLARE
  soju_id uuid;
  shochu_id uuid;
  baijiu_id uuid;
BEGIN
  SELECT id INTO soju_id FROM alcohol_types WHERE name = 'Soju';
  SELECT id INTO shochu_id FROM alcohol_types WHERE name = 'Shochu';
  SELECT id INTO baijiu_id FROM alcohol_types WHERE name = 'Baijiu';

  -- Insert soju subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (soju_id, 'Traditional Soju', 'Korea',
   'Premium soju made purely from rice.',
   20, 45,
   ARRAY['rice', 'clean', 'subtle', 'smooth'],
   ARRAY['Traditional', 'Pure', 'Complex', 'Smooth'],
   'Made from rice using traditional distillation methods.'
  ),
  (soju_id, 'Modern Soju', 'Korea',
   'Contemporary soju made from various starches.',
   17, 25,
   ARRAY['neutral', 'light', 'clean', 'subtle'],
   ARRAY['Light', 'Accessible', 'Modern', 'Versatile'],
   'Made from various starches with modern production methods.'
  );

  -- Insert shochu subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (shochu_id, 'Imo Shochu', 'Japan',
   'Sweet potato shochu with distinctive character.',
   25, 37,
   ARRAY['sweet potato', 'earthy', 'rich', 'complex'],
   ARRAY['Rich', 'Complex', 'Traditional', 'Unique'],
   'Single-distilled from sweet potatoes using koji fermentation.'
  ),
  (shochu_id, 'Mugi Shochu', 'Japan',
   'Barley shochu with clean, grainy profile.',
   25, 37,
   ARRAY['grain', 'clean', 'light', 'smooth'],
   ARRAY['Clean', 'Smooth', 'Refined', 'Versatile'],
   'Made from malted barley using koji fermentation.'
  );

  -- Insert baijiu subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (baijiu_id, 'Sauce Aroma', 'China',
   'Complex baijiu with umami character.',
   50, 65,
   ARRAY['soy sauce', 'mushroom', 'rich', 'complex'],
   ARRAY['Complex', 'Rich', 'Traditional', 'Powerful'],
   'Multiple fermentations and distillations using wheat qu.'
  ),
  (baijiu_id, 'Light Aroma', 'China',
   'Clean, subtle style of baijiu.',
   50, 65,
   ARRAY['clean', 'subtle', 'floral', 'light'],
   ARRAY['Light', 'Clean', 'Delicate', 'Refined'],
   'Single fermentation and distillation using rice qu.'
  );

  -- Insert brands for Asian spirits
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Traditional Soju' THEN 'Hwayo 41'
      WHEN name = 'Modern Soju' THEN 'Jinro Fresh'
      WHEN name = 'Imo Shochu' THEN 'Shiranami Kuro'
      WHEN name = 'Mugi Shochu' THEN 'Iichiko Silhouette'
      WHEN name = 'Sauce Aroma' THEN 'Moutai'
      WHEN name = 'Light Aroma' THEN 'Fenjiu'
    END,
    CASE 
      WHEN name = 'Traditional Soju' THEN 'Premium traditional rice soju.'
      WHEN name = 'Modern Soju' THEN 'Popular modern style soju.'
      WHEN name = 'Imo Shochu' THEN 'Premium sweet potato shochu.'
      WHEN name = 'Mugi Shochu' THEN 'Clean, versatile barley shochu.'
      WHEN name = 'Sauce Aroma' THEN 'Prestigious sauce aroma baijiu.'
      WHEN name = 'Light Aroma' THEN 'Refined light aroma baijiu.'
    END,
    CASE 
      WHEN name = 'Traditional Soju' THEN 41
      WHEN name = 'Modern Soju' THEN 17.8
      WHEN name = 'Imo Shochu' THEN 25
      WHEN name = 'Mugi Shochu' THEN 25
      WHEN name = 'Sauce Aroma' THEN 53
      WHEN name = 'Light Aroma' THEN 53
    END,
    CASE 
      WHEN name = 'Traditional Soju' THEN ARRAY['rice', 'clean', 'complex', 'smooth']
      WHEN name = 'Modern Soju' THEN ARRAY['light', 'clean', 'subtle', 'fresh']
      WHEN name = 'Imo Shochu' THEN ARRAY['sweet potato', 'earthy', 'rich', 'complex']
      WHEN name = 'Mugi Shochu' THEN ARRAY['grain', 'clean', 'light', 'smooth']
      WHEN name = 'Sauce Aroma' THEN ARRAY['umami', 'complex', 'rich', 'powerful']
      WHEN name = 'Light Aroma' THEN ARRAY['clean', 'floral', 'subtle', 'refined']
    END,
    CASE 
      WHEN name = 'Traditional Soju' THEN '$30-40'
      WHEN name = 'Modern Soju' THEN '$8-12'
      WHEN name = 'Imo Shochu' THEN '$25-35'
      WHEN name = 'Mugi Shochu' THEN '$25-35'
      WHEN name = 'Sauce Aroma' THEN '$300-400'
      WHEN name = 'Light Aroma' THEN '$50-70'
    END
  FROM subtypes 
  WHERE alcohol_type_id IN (soju_id, shochu_id, baijiu_id);
END $$;

-- Insert European Spirits (Akvavit, Grappa)
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES
  ('Akvavit',
   'A Scandinavian spirit flavored with caraway and other herbs.',
   'Traditional in Scandinavia since the 15th century, akvavit is often associated with festive gatherings and traditional foods.',
   ARRAY[
     'The name comes from Latin aqua vitae, meaning water of life',
     'It''s traditionally drunk as a shot with beer',
     'Some versions are aged in oak barrels at sea',
     'Each Scandinavian country has its own style'
   ]
  ),
  ('Grappa',
   'An Italian brandy made from grape pomace.',
   'Originally created as a way to use leftover grape materials from winemaking, grappa has evolved into a sophisticated spirit.',
   ARRAY[
     'Must be produced in Italy to be called grappa',
     'Made from grape pomace, the solids left from winemaking',
     'Modern grappa production began in the 1970s',
     'Some producers use single grape varieties'
   ]
  );

-- Insert subtypes for European spirits
DO $$
DECLARE
  akvavit_id uuid;
  grappa_id uuid;
BEGIN
  SELECT id INTO akvavit_id FROM alcohol_types WHERE name = 'Akvavit';
  SELECT id INTO grappa_id FROM alcohol_types WHERE name = 'Grappa';

  -- Insert akvavit subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (akvavit_id, 'Traditional Akvavit', 'Scandinavia',
   'Classic caraway-forward style.',
   40, 45,
   ARRAY['caraway', 'dill', 'citrus', 'spice'],
   ARRAY['Traditional', 'Spicy', 'Complex', 'Aromatic'],
   'Neutral spirit flavored with caraway and other botanicals.'
  ),
  (akvavit_id, 'Aged Akvavit', 'Scandinavia',
   'Oak-aged version with additional complexity.',
   40, 45,
   ARRAY['caraway', 'oak', 'vanilla', 'spice'],
   ARRAY['Complex', 'Smooth', 'Refined', 'Mature'],
   'Traditional akvavit aged in oak barrels.'
  );

  -- Insert grappa subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (grappa_id, 'Young Grappa', 'Italy',
   'Unaged grappa with fresh character.',
   37.5, 45,
   ARRAY['grape', 'floral', 'fresh', 'fruity'],
   ARRAY['Fresh', 'Vibrant', 'Pure', 'Intense'],
   'Distilled from fresh grape pomace without aging.'
  ),
  (grappa_id, 'Aged Grappa', 'Italy',
   'Oak-aged grappa with enhanced complexity.',
   40, 45,
   ARRAY['grape', 'vanilla', 'oak', 'spice'],
   ARRAY['Complex', '
Smooth', 'Refined', 'Mature'],
   'Aged in oak barrels for at least 12 months.'
  );

  -- Insert brands for European spirits
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Traditional Akvavit' THEN 'Aalborg Taffel'
      WHEN name = 'Aged Akvavit' THEN 'Linie'
      WHEN name = 'Young Grappa' THEN 'Nonino Tradizione'
      WHEN name = 'Aged Grappa' THEN 'Poli Barrique'
    END,
    CASE 
      WHEN name = 'Traditional Akvavit' THEN 'Classic Danish akvavit.'
      WHEN name = 'Aged Akvavit' THEN 'Norwegian akvavit aged at sea.'
      WHEN name = 'Young Grappa' THEN 'Traditional unaged grappa.'
      WHEN name = 'Aged Grappa' THEN 'Oak-aged premium grappa.'
    END,
    CASE 
      WHEN name = 'Traditional Akvavit' THEN 45
      WHEN name = 'Aged Akvavit' THEN 41.5
      WHEN name = 'Young Grappa' THEN 40
      WHEN name = 'Aged Grappa' THEN 40
    END,
    CASE 
      WHEN name = 'Traditional Akvavit' THEN ARRAY['caraway', 'dill', 'citrus', 'spice']
      WHEN name = 'Aged Akvavit' THEN ARRAY['caraway', 'oak', 'vanilla', 'spice']
      WHEN name = 'Young Grappa' THEN ARRAY['grape', 'floral', 'fresh', 'fruity']
      WHEN name = 'Aged Grappa' THEN ARRAY['grape', 'vanilla', 'oak', 'spice']
    END,
    CASE 
      WHEN name = 'Traditional Akvavit' THEN '$25-35'
      WHEN name = 'Aged Akvavit' THEN '$35-45'
      WHEN name = 'Young Grappa' THEN '$35-45'
      WHEN name = 'Aged Grappa' THEN '$45-60'
    END
  FROM subtypes 
  WHERE alcohol_type_id IN (akvavit_id, grappa_id);
END $$;

-- Insert Vermouth and Fortified Wines
INSERT INTO alcohol_types (name, description, history, fun_facts) VALUES (
  'Vermouth',
  'Aromatized fortified wine flavored with various botanicals.',
  'Originally created for medicinal purposes in Turin, Italy, vermouth became popular as an aperitif and cocktail ingredient.',
  ARRAY[
    'The word vermouth comes from the German "wermut" meaning wormwood',
    'Traditional vermouth must contain wormwood',
    'It was one of the first cocktail ingredients',
    'Vermouth should be refrigerated after opening'
  ]
);

-- Get the vermouth type ID and insert subtypes
DO $$
DECLARE
  vermouth_id uuid;
BEGIN
  SELECT id INTO vermouth_id FROM alcohol_types WHERE name = 'Vermouth';

  -- Insert vermouth subtypes
  INSERT INTO subtypes (alcohol_type_id, name, region, description, abv_min, abv_max, flavor_profile, characteristics, production_method) VALUES
  (vermouth_id, 'Dry Vermouth', 'France/Italy',
   'Light, dry style essential for martinis.',
   16, 18,
   ARRAY['herbs', 'citrus', 'floral', 'dry'],
   ARRAY['Dry', 'Light', 'Crisp', 'Herbal'],
   'White wine base fortified and flavored with herbs and botanicals.'
  ),
  (vermouth_id, 'Sweet Vermouth', 'Italy',
   'Rich, sweet style used in many classic cocktails.',
   16, 18,
   ARRAY['caramel', 'herbs', 'spice', 'bitter'],
   ARRAY['Sweet', 'Rich', 'Complex', 'Balanced'],
   'Red wine base fortified and flavored with caramelized sugar and botanicals.'
  );

  -- Insert vermouth brands
  INSERT INTO brands (subtype_id, name, description, abv, tasting_notes, price_range) 
  SELECT 
    id,
    CASE 
      WHEN name = 'Dry Vermouth' THEN 'Dolin Dry'
      WHEN name = 'Sweet Vermouth' THEN 'Carpano Antica Formula'
    END,
    CASE 
      WHEN name = 'Dry Vermouth' THEN 'Classic French dry vermouth.'
      WHEN name = 'Sweet Vermouth' THEN 'Premium Italian sweet vermouth.'
    END,
    CASE 
      WHEN name = 'Dry Vermouth' THEN 17.5
      WHEN name = 'Sweet Vermouth' THEN 16.5
    END,
    CASE 
      WHEN name = 'Dry Vermouth' THEN ARRAY['herbs', 'citrus', 'floral', 'dry']
      WHEN name = 'Sweet Vermouth' THEN ARRAY['vanilla', 'spice', 'herbs', 'bitter']
    END,
    CASE 
      WHEN name = 'Dry Vermouth' THEN '$15-20'
      WHEN name = 'Sweet Vermouth' THEN '$30-40'
    END
  FROM subtypes 
  WHERE alcohol_type_id = vermouth_id;
END $$;