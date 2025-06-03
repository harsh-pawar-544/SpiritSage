/*
  # Add initial spirit data

  1. New Data
    - Adds initial alcohol types (Whiskey, Gin)
    - Adds subtypes (Japanese Whisky, London Dry Gin)
    - Adds example brands (Yamazaki 12)
    
  2. Data Structure
    - Each entry includes comprehensive historical information
    - Includes verified myths and fun facts
    - Contains detailed production methods and characteristics
*/

-- First, add the main alcohol types
INSERT INTO alcohol_types (id, name, description, history, fun_facts, myths, image_url)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Whiskey',
    'A diverse spirit family encompassing various styles from around the world, each with its own unique character and tradition.',
    'Whiskey''s history dates back to medieval monks who brought the art of distillation from mainland Europe to Ireland and Scotland. The word "whiskey" comes from the Gaelic "uisge beatha" meaning "water of life". Each region developed its own distinct style based on local ingredients and traditions.',
    ARRAY[
      'The spelling varies: "whiskey" in Ireland and America, "whisky" in Scotland, Canada, and Japan',
      'A closed bottle of whiskey can be kept for over 100 years without deteriorating',
      'The angels'' share refers to the 2% of whiskey that evaporates during aging each year'
    ],
    ARRAY[
      'Age always determines quality - Many excellent whiskeys are relatively young',
      'Only Scotch can be called whisky - Many countries produce outstanding whiskies',
      'Whiskey must be drunk neat - Adding water can enhance flavors'
    ],
    'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  ),
  (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Gin',
    'A spirit defined by juniper berries and botanical infusions, crafted in diverse styles.',
    'Gin evolved from Dutch genever in the 17th century. It gained popularity in England during the "Gin Craze" of the 18th century. London Dry Gin emerged as a quality standard in the 19th century, requiring all botanicals to be added during distillation.',
    ARRAY[
      'The term "Dutch Courage" comes from British soldiers drinking gin before battle',
      'London Dry Gin doesn''t have to be made in London',
      'Gin was originally sold as a medicine in the 1600s'
    ],
    ARRAY[
      'All gin tastes like juniper - Many modern gins are balanced differently',
      'Gin is just flavored vodka - The production process is quite different',
      'Gin and tonic prevents malaria - Only the quinine in tonic has this effect'
    ],
    'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg'
  );

-- Add subtypes for each alcohol type
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
    ARRAY['Floral', 'Honey', 'Citrus', 'Oak', 'Incense'],
    ARRAY['Refined', 'Complex', 'Balanced', 'Subtle'],
    'Uses Scottish methods adapted to Japanese conditions, with pure mountain water and carefully selected malts. Often aged in various casks including rare Mizunara oak.',
    'Japanese whisky production began in the 1920s, led by Masataka Taketsuru who studied in Scotland. The industry grew slowly but gained international recognition in the 2000s.',
    ARRAY[
      'Mizunara oak casks can cost up to 10 times more than American oak',
      'Japanese distilleries often choose locations similar to Scotland''s climate',
      'The Japanese climate accelerates the aging process compared to Scotland'
    ],
    ARRAY[
      'All Japanese whisky is made in Japan - Some is imported and bottled',
      'Japanese whisky is always expensive - Entry-level options exist',
      'It''s just a copy of Scotch - Japanese whisky has unique characteristics'
    ],
    'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg'
  ),
  (
    'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'London Dry Gin',
    'The classic gin style that defines the category, characterized by prominent juniper and balanced botanicals.',
    'Global',
    37.5,
    50.0,
    ARRAY['Juniper', 'Citrus', 'Coriander', 'Angelica', 'Orris Root'],
    ARRAY['Crisp', 'Complex', 'Balanced', 'Botanical'],
    'Neutral spirit redistilled with juniper berries and other botanicals. All flavoring must come from distillation, with no post-distillation additions except water.',
    'Emerged in the late 19th century as a response to poor quality gin. The style became legally defined in the 20th century, setting quality standards for gin production.',
    ARRAY[
      'The term refers to the production method, not the location',
      'Must contain juniper as the predominant flavor',
      'No artificial flavoring is allowed'
    ],
    ARRAY[
      'Must be made in London - Can be produced anywhere',
      'All London Dry Gins taste the same - Each has a unique recipe',
      'Only good for G&Ts - Versatile in many cocktails'
    ],
    'https://images.pexels.com/photos/5947036/pexels-photo-5947036.jpeg'
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
    ARRAY['Honey', 'Orange', 'Peach', 'Mizunara Oak', 'Subtle Smoke'],
    'Premium',
    'Created at Japan''s first malt whisky distillery, established in 1923 by Suntory''s founder Shinjiro Torii.',
    ARRAY[
      'Uses water from bamboo groves considered among Japan''s best tea-water sources',
      'Aged in three different oak types: American, Spanish, and Japanese Mizunara',
      'Won multiple international awards since 2003'
    ],
    ARRAY[
      'Only good for sipping neat - Makes excellent cocktails',
      'Recent quality decline due to popularity - Maintains strict standards',
      'Age statement guarantees better quality - Young whiskies can be excellent'
    ],
    'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'
  );