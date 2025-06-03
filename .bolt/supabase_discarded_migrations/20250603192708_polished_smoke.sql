-- First, add the main alcohol types
INSERT INTO alcohol_types (id, name, description, history, fun_facts, myths, image_url)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Whiskey',
    'A diverse spirit family encompassing various styles from around the world, each with its own unique character and tradition.',
    'Whiskey''s history dates back to medieval monks who brought the art of distillation from mainland Europe to Ireland and Scotland. The word "whiskey" comes from the Gaelic "uisge beatha" meaning "water of life". Each region developed its own distinct style based on local ingredients and traditions, leading to the rich diversity we see today. From Scottish single malts to American bourbon, Irish whiskey to Japanese expressions, each style tells a story of its origin, culture, and craftsmanship.',
    ARRAY[
      'The spelling varies: "whiskey" in Ireland and America, "whisky" in Scotland, Canada, and Japan',
      'A closed bottle of whiskey can be kept for over 100 years without deteriorating',
      'The angels'' share refers to the 2% of whiskey that evaporates during aging each year',
      'Kentucky has more barrels of bourbon aging than it has residents',
      'Scotland has over 130 active whisky distilleries across five distinct regions',
      'The oldest licensed whiskey distillery is in Ireland (Old Bushmills, 1608)'
    ],
    ARRAY[
      'Age always determines quality - Many excellent whiskeys are relatively young',
      'Only Scotch can be called whisky - Many countries produce outstanding whiskies',
      'Whiskey must be drunk neat - Adding water can enhance flavors',
      'Dark color means better quality - Color can be adjusted with caramel',
      'Single malts are superior to blends - Both styles have their merits',
      'Bourbon must be made in Kentucky - It can be made anywhere in the USA'
    ],
    'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  );

-- Add whiskey subtypes
INSERT INTO subtypes (id, alcohol_type_id, name, description, region, abv_min, abv_max, flavor_profile, characteristics, production_method, history, fun_facts, myths, image_url)
VALUES
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Japanese Whisky',
    'A meticulous fusion of Scottish tradition and Japanese precision, known for exceptional balance and refinement.',
    'Japan',
    43.0,
    50.0,
    ARRAY['Floral', 'Honey', 'Citrus', 'Oak', 'Incense', 'Green Tea', 'Sandalwood'],
    ARRAY['Refined', 'Complex', 'Balanced', 'Subtle', 'Elegant', 'Precise'],
    'Uses Scottish methods adapted to Japanese conditions, with pure mountain water and carefully selected malts. Often aged in various casks including rare Mizunara oak.',
    'Japanese whisky production began in the 1920s, led by Masataka Taketsuru who studied in Scotland. The industry grew slowly but gained international recognition in the 2000s with numerous awards and accolades.',
    ARRAY[
      'Mizunara oak casks can cost up to 10 times more than American oak',
      'Japanese distilleries often choose locations similar to Scotland''s climate',
      'The Japanese climate accelerates the aging process compared to Scotland',
      'Many Japanese distilleries use imported Scottish peat',
      'Water sources are often chosen based on their similarity to Scottish springs'
    ],
    ARRAY[
      'All Japanese whisky is made in Japan - Some is imported and bottled',
      'Japanese whisky is always expensive - Entry-level options exist',
      'It''s just a copy of Scotch - Japanese whisky has unique characteristics',
      'Only good for highballs - Excellent in many serving styles',
      'Must be aged in Japanese oak - Various cask types are used'
    ],
    'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg'
  ),
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Scotch Single Malt',
    'The original single malt whisky, crafted in Scotland using traditional methods and local ingredients.',
    'Scotland',
    40.0,
    60.0,
    ARRAY['Heather', 'Honey', 'Peat', 'Oak', 'Maritime', 'Fruit', 'Smoke'],
    ARRAY['Complex', 'Traditional', 'Regional', 'Distinctive', 'Robust'],
    'Made from 100% malted barley, distilled in copper pot stills, and aged for a minimum of 3 years in oak casks within Scotland.',
    'Single malt Scotch has been produced since the 15th century, evolving from a monastic tradition to a globally renowned spirit. Each region of Scotland imparts its own character to the whisky.',
    ARRAY[
      'Each distillery has uniquely shaped stills that affect flavor',
      'The water source is crucial for flavor development',
      'Scotch must be aged in Scotland to be called Scotch',
      'Peat is measured in phenol parts per million (PPM)',
      'Some distilleries still maintain their own floor maltings'
    ],
    ARRAY[
      'All Scotch is smoky - Only some regions use peat',
      'Age equals quality - Young whisky can be excellent',
      'Must be drunk neat - Water can enhance flavors',
      'Single malts are better than blends - Both have merit',
      'Color indicates age - Caramel coloring is common'
    ],
    'https://images.pexels.com/photos/5947552/pexels-photo-5947552.jpeg'
  );

-- Add example brands for each subtype
INSERT INTO brands (id, subtype_id, name, description, abv, tasting_notes, price_range, history, fun_facts, myths, image_url)
VALUES
  (
    'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Yamazaki 12 Year',
    'A pioneering Japanese single malt that embodies the harmony between power and elegance.',
    43.0,
    ARRAY['Honey', 'Orange', 'Peach', 'Mizunara Oak', 'Subtle Smoke', 'Green Tea', 'Coconut'],
    'Premium',
    'Created at Japan''s first malt whisky distillery, established in 1923 by Suntory''s founder Shinjiro Torii. The distillery location was chosen for its pristine water source and unique climate conditions.',
    ARRAY[
      'Uses water from bamboo groves considered among Japan''s best tea-water sources',
      'Aged in three different oak types: American, Spanish, and Japanese Mizunara',
      'Won multiple international awards since 2003',
      'The distillery experiences four distinct seasons, affecting maturation',
      'Uses both peated and unpeated malt in production'
    ],
    ARRAY[
      'Only good for sipping neat - Makes excellent cocktails',
      'Recent quality decline due to popularity - Maintains strict standards',
      'Age statement guarantees better quality - Young whiskies can be excellent',
      'Only uses Japanese oak - Uses multiple oak types',
      'Too delicate for mixing - Works well in cocktails'
    ],
    'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  ),
  (
    'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Macallan 12 Year',
    'A sherried Highland single malt known for its rich, complex character and exceptional quality.',
    43.0,
    ARRAY['Sherry', 'Oak', 'Dried Fruit', 'Vanilla', 'Spice', 'Orange', 'Chocolate'],
    'Premium',
    'The Macallan distillery was founded in 1824 and is known for its strict wood policy and high percentage of sherry cask maturation. Located in Speyside, it draws water from springs beneath the grounds of Easter Elchies House.',
    ARRAY[
      'Owns its own forests in Spain for crafting sherry casks',
      'Uses only 16% of the spirit cut compared to industry standard 20-25%',
      'Each sherry-seasoned cask costs over $1000 to produce',
      'The new distillery opened in 2018 with a unique architectural design',
      'Uses golden promise barley, a premium variety'
    ],
    ARRAY[
      'Only uses sherry casks - Also uses bourbon casks',
      'Natural color comes from age - Comes from sherry casks',
      'Must be aged 12 years minimum - Various ages produced',
      'Only good as a collector''s item - Meant to be enjoyed',
      'Recent releases are lower quality - Maintains standards'
    ],
    'https://images.pexels.com/photos/6638905/pexels-photo-6638905.jpeg'
  );