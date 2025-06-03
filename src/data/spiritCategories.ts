import { type SpiritSubtype, type SpiritCategory } from './types';

export const spiritCategories: SpiritCategory[] = [
  {
    id: 'absinthe',
    name: 'Absinthe',
    description: 'The "Green Fairy" - a highly alcoholic spirit flavored with botanicals, primarily green anise, sweet fennel, and wormwood.',
    image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg',
    subtypes: [
      {
        id: 'traditional',
        name: 'Traditional Absinthe',
        description: 'Classic Swiss-French style absinthe, known for its complex botanical profile and traditional preparation method.',
        image: 'https://images.pexels.com/photos/5947036/pexels-photo-5947036.jpeg',
        details: {
          characteristics: ['Anise', 'Herbal', 'Complex', 'Botanical'],
          tastingNotes: 'Strong anise and fennel notes, followed by complex herbal undertones from wormwood and other botanicals. The finish reveals subtle notes of mint and citrus.',
          history: 'Originated in Switzerland in the late 18th century. Gained immense popularity in France during the 19th century, particularly among artists and writers. Banned in many countries in the early 20th century due to misconceptions about its effects, but has experienced a revival since the 1990s.',
          productionMethod: 'Herbs are macerated in neutral spirits, then distilled. The distillate is then colored naturally using additional herbs. Traditional serving involves slowly dripping water over a sugar cube.',
          myths: [
            'Absinthe makes you hallucinate - This is a misconception based on poor quality historical products',
            'The wormwood in absinthe is deadly - Modern absinthe is strictly regulated and safe',
            'Real absinthe must be artificially colored - Traditional absinthes are naturally colored'
          ],
          funFacts: [
            'The louche effect (clouding when water is added) is caused by essential oils from the herbs',
            'Famous artists like Van Gogh and Picasso were known absinthe enthusiasts',
            'Modern absinthe must contain less than 35mg/kg of thujone to be legal in the EU'
          ],
          stats: {
            abv: '45-74%',
            origin: 'Switzerland/France',
            category: 'Traditional Absinthe'
          }
        }
      }
    ]
  },
  {
    id: 'brandy',
    name: 'Brandy',
    description: 'A sophisticated spirit distilled from wine or fruit juice.',
    image: 'https://images.pexels.com/photos/3858347/pexels-photo-3858347.jpeg',
    subtypes: [
      {
        id: 'cognac',
        name: 'Cognac',
        description: 'The world\'s most prestigious brandy from France.',
        image: 'https://images.pexels.com/photos/6638087/pexels-photo-6638087.jpeg',
        details: {
          characteristics: ['Elegant', 'Fruity', 'Complex', 'Oak'],
          tastingNotes: 'Dried fruits, vanilla, and spice with floral notes.',
          history: 'Developed in the 16th century in the Cognac region of France.',
          productionMethod: 'Double-distilled in copper pot stills, aged in French oak.',
          myths: [
            'All cognac is expensive - Entry-level options exist',
            'Only for after dinner - Versatile in cocktails',
            'Age statements tell full story - Blending is crucial'
          ],
          funFacts: [
            'Must be made from specific grape varieties',
            'The angels\' share in Cognac is about 2% per year',
            'VS, VSOP, and XO indicate minimum aging periods'
          ],
          stats: {
            abv: '40%',
            origin: 'France',
            category: 'Cognac'
          }
        }
      }
    ]
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'A spirit defined by juniper berries and botanical infusions, crafted in diverse styles.',
    image: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg',
    subtypes: [
      {
        id: 'london-dry',
        name: 'London Dry Gin',
        description: 'The classic style that defines gin for many.',
        image: 'https://images.pexels.com/photos/5947036/pexels-photo-5947036.jpeg',
        details: {
          characteristics: ['Juniper', 'Citrus', 'Crisp', 'Botanical'],
          tastingNotes: 'Bold juniper forward, with bright citrus notes and a complex botanical backbone.',
          history: 'Evolved from Dutch genever in the 17th century. Became popular during the British Raj.',
          productionMethod: 'Neutral spirit redistilled with juniper berries and other botanicals. No artificial flavoring allowed.',
          myths: [
            'London Dry Gin must be made in London - It can be made anywhere',
            'Gin is just flavored vodka - The production process is quite different',
            'All gins taste the same - Each has a unique botanical profile'
          ],
          funFacts: [
            'The term "Dutch Courage" comes from soldiers drinking gin before battle',
            'Tonic water was originally used as medicine against malaria',
            'The gin & tonic was created by British officers in India'
          ],
          stats: {
            abv: '37.5-50%',
            origin: 'England',
            category: 'London Dry Gin'
          }
        }
      }
    ]
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'A spirit born in the Caribbean, made from sugarcane or molasses.',
    image: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg',
    subtypes: [
      {
        id: 'caribbean',
        name: 'Caribbean Rum',
        description: 'Traditional rum from the Caribbean islands.',
        image: 'https://images.pexels.com/photos/5947024/pexels-photo-5947024.jpeg',
        details: {
          characteristics: ['Tropical', 'Sweet', 'Complex', 'Smooth'],
          tastingNotes: 'Rich molasses, tropical fruits, and vanilla in aged varieties.',
          history: 'Originated in the Caribbean during the 17th century sugar trade.',
          productionMethod: 'Made from sugarcane juice or molasses, fermented and distilled.',
          myths: [
            'All rum is sweet - Many styles are quite dry',
            'Dark rum is always aged - Color can be added',
            'Rum has no rules - Many regions have strict regulations'
          ],
          funFacts: [
            'Rum was part of the daily ration for British Royal Navy sailors',
            'The term "proof" comes from testing rum\'s alcohol content with gunpowder',
            'Caribbean rums age faster due to the tropical climate'
          ],
          stats: {
            abv: '40-75%',
            origin: 'Caribbean',
            category: 'Rum'
          }
        }
      }
    ]
  },
  {
    id: 'tequila',
    name: 'Tequila',
    description: 'Mexico\'s premier spirit, made from blue agave.',
    image: 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg',
    subtypes: [
      {
        id: 'blanco',
        name: 'Blanco Tequila',
        description: 'Pure, unaged tequila showcasing agave\'s natural flavors.',
        image: 'https://images.pexels.com/photos/8105037/pexels-photo-8105037.jpeg',
        details: {
          characteristics: ['Agave', 'Citrus', 'Pepper', 'Clean'],
          tastingNotes: 'Pure agave flavors with citrus, black pepper, and mineral notes.',
          history: 'The traditional form of tequila, unaged to showcase agave character.',
          productionMethod: 'Made from 100% blue agave, cooked, crushed, fermented, and distilled.',
          myths: [
            'All tequila has a worm - That\'s mezcal, and not all mezcal',
            'Tequila is always harsh - Premium tequilas are smooth',
            'Only for shots - Quality tequila should be sipped'
          ],
          funFacts: [
            'Blue agave takes 7-10 years to mature',
            'Tequila can only be produced in specific regions of Mexico',
            'The agave plant is related to lilies, not cacti'
          ],
          stats: {
            abv: '38-55%',
            origin: 'Mexico',
            category: 'Blanco Tequila'
          }
        }
      }
    ]
  },
  {
    id: 'whiskey',
    name: 'Whiskey',
    description: 'From smooth bourbon to peaty scotch, explore the diverse world of whiskey. A distilled alcoholic beverage made from fermented grain mash, aged in wooden barrels.',
    image: 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg',
    subtypes: [
      {
        id: 'japanese',
        name: 'Elegance Blossom Japanese Whisky',
        description: 'Japanese whisky embodies a philosophy of meticulous craftsmanship, balance, and understated elegance. Often inspired by Scotch methods but with a distinct Japanese sensitivity, these whiskies are renowned for their exceptional smoothness, purity, and subtle complexities. They typically feature pristine water sources, diverse aging casks (including Mizunara oak), and unique blending artistry that results in harmonious flavor profiles ranging from delicate floral and fruity notes to deep, rich caramel and smoky undertones. Each sip offers a journey of refined discovery.',
        image: 'https://images.pexels.com/photos/6638640/pexels-photo-6638640.jpeg',
        details: {
          characteristics: ['Refined', 'Floral', 'Complex', 'Balanced'],
          tastingNotes: 'Delicate floral notes with hints of honey and citrus, balanced by subtle oak and a touch of incense from Mizunara casks.',
          history: 'The history of Japanese whisky begins in the early 20th century, spearheaded by two pioneering figures: Shinjiro Torii, who founded Suntory, and Masataka Taketsuru, who established Nikka Whisky. Taketsuru, often regarded as the \'father of Japanese whisky,\' studied whisky production in Scotland, bringing back invaluable knowledge. Despite early challenges, Japanese distilleries meticulously honed their craft, adapting Scottish techniques to their unique climate and ingredients. Their dedication to quality and pursuit of perfection eventually led to widespread international acclaim, with Japanese whiskies now among the most highly regarded and sought-after in the world.',
          productionMethod: 'Crafted using Scottish methods adapted to Japanese conditions, with pure mountain water and carefully selected malts. Aged in various casks including rare Mizunara oak.',
          myths: [
            'All Japanese whisky is made in Japan - Some is imported and bottled',
            'Japanese whisky is always expensive - Entry-level options exist',
            'It\'s just a copy of Scotch - Japanese whisky has unique characteristics'
          ],
          funFacts: [
            'Mizunara oak casks can cost up to 10 times more than American oak',
            'Japanese distilleries are often located in areas chosen for their similarity to Scotland',
            'The Japanese climate accelerates the aging process compared to Scotland'
          ],
          stats: {
            abv: '43-50%',
            origin: 'Japan',
            category: 'Japanese Single Malt Whisky'
          }
        }
      },
      {
        id: 'canadian',
        name: 'Smooth Frontier Canadian Rye',
        description: 'Canadian whisky is renowned for its exceptional smoothness, lightness, and approachable character, often making it a versatile choice for both sipping neat and in cocktails. Distinctively, most Canadian whiskies are blends of various grain spirits (primarily corn, rye, barley, and wheat) that are often distilled and aged separately before blending. This allows for a broad spectrum of styles and a hallmark of their production. Legally, it must be aged for at least three years in small wooden barrels in Canada, contributing to its mellow and refined profile, frequently with notes of vanilla, caramel, and a signature peppery rye spice.',
        image: 'https://images.pexels.com/photos/6638642/pexels-photo-6638642.jpeg',
        details: {
          characteristics: ['Smooth', 'Light', 'Versatile', 'Spicy'],
          tastingNotes: 'Gentle vanilla and caramel sweetness balanced by rye spice, with hints of maple, toffee, and toasted grain.',
          history: 'The history of Canadian whisky is deeply intertwined with North American history, particularly gaining significant prominence during the U.S. Prohibition era (1920-1933) when it was legally produced and easily smuggled across the border. Early Canadian distillers, many with British Isles heritage, leveraged the abundant grain harvests. Unlike some other whisky traditions, the practice of blending different grain distillates after aging became a cornerstone of Canadian whisky production early on, contributing to its signature lightness and versatility. This heritage has fostered a rich tradition of master blenders who skillfully combine various whiskies to achieve consistent quality and a wide array of nuanced flavors, cementing its place as a beloved spirit globally.',
          productionMethod: 'Multiple grains distilled separately and aged in oak barrels before blending. Minimum three years aging required.',
          myths: [
            'All Canadian whisky is rye whisky - Most use very little rye',
            'Canadian whisky is always light and mild - Many bold options exist',
            'It must contain maple syrup - This is rarely used in production'
          ],
          funFacts: [
            'Canadian whisky was a major beneficiary of U.S. Prohibition',
            'It\'s often called rye whisky even when made mostly from corn',
            'Canada has no strict rules about grain percentages in their whisky'
          ],
          stats: {
            abv: '40-45%',
            origin: 'Canada',
            category: 'Canadian Whisky'
          }
        }
      },
      {
        id: 'scotch',
        name: 'Scotch Whisky',
        description: 'Single malts and blends from Scotland\'s historic distilleries.',
        image: 'https://images.pexels.com/photos/6638905/pexels-photo-6638905.jpeg',
        details: {
          characteristics: ['Peaty', 'Smoky', 'Complex', 'Maritime'],
          tastingNotes: 'Varies by region - Islay: intense peat and smoke; Speyside: fruit and honey; Highland: heather and subtle smoke; Lowland: light and floral.',
          history: 'First recorded in 1494 as "water of life" (uisge beatha). Originally used medicinally by monks, evolved into Scotland\'s national spirit.',
          productionMethod: 'Made from malted barley, water, and yeast. Double distilled in copper pot stills. Aged minimum 3 years in oak casks.',
          myths: [
            'Older whisky is always better - Age is just one factor in quality',
            'Adding water ruins whisky - A few drops can actually enhance flavors',
            'Single malts are superior to blends - Both have their merits'
          ],
          funFacts: [
            'The word "whisky" comes from the Gaelic "uisge beatha" meaning "water of life"',
            'Scotland has more distilleries than any other country in the world',
            'A closed bottle of whisky can be kept for over 100 years without deteriorating'
          ],
          stats: {
            abv: '40-46%',
            origin: 'Scotland',
            category: 'Single Malt & Blended Whisky'
          }
        }
      },
      {
        id: 'bourbon',
        name: 'Bourbon',
        description: 'America\'s native spirit, known for sweet, rich flavors.',
        image: 'https://images.pexels.com/photos/5947552/pexels-photo-5947552.jpeg',
        details: {
          characteristics: ['Sweet', 'Vanilla', 'Caramel', 'Oak'],
          tastingNotes: 'Rich vanilla and caramel from new charred oak, with sweet corn backbone. Notes of cinnamon, nutmeg, and toasted wood.',
          history: 'Named after Bourbon County, Kentucky. Developed by early settlers using local corn and limestone water.',
          productionMethod: 'Must be made from at least 51% corn, aged in new charred oak barrels. Must be produced in the United States.',
          myths: [
            'All bourbon comes from Kentucky - It can be made anywhere in the US',
            'Bourbon must be aged for at least 2 years - No minimum age requirement exists',
            'Tennessee Whiskey is bourbon - It\'s technically a separate category'
          ],
          funFacts: [
            'During Prohibition, bourbon was one of few spirits legally available with a prescription',
            'Kentucky produces 95% of the world\'s bourbon',
            'The name has nothing to do with French royalty'
          ],
          stats: {
            abv: '40-50%',
            origin: 'United States',
            category: 'American Whiskey'
          }
        }
      }
    ]
  }
];

export const getSpiritById = (id: string): SpiritSubtype | undefined => {
  for (const category of spiritCategories) {
    const spirit = category.subtypes.find(s => s.id === id);
    if (spirit) return spirit;
  }
  return undefined;
};

export const getSimilarSpirits = (id: string, limit: number = 3): SpiritSubtype[] => {
  const spirit = getSpiritById(id);
  if (!spirit) return [];

  const category = spiritCategories.find(c => 
    c.subtypes.some(s => s.id === id)
  );

  if (!category) return [];

  return category.subtypes
    .filter(s => s.id !== id)
    .slice(0, limit);
};