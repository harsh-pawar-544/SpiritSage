export interface Spirit {
  id: string;
  name: string;
  type: string;
  region: string;
  imageSrc: string;
  avgRating: number;
  description: string;
  flavorProfile: string[];
  history: string;
}

export const mockSpirits: Spirit[] = [
  {
    id: "highland-single-malt",
    name: "Highland Single Malt",
    type: "Whiskey",
    region: "Scotland",
    imageSrc: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg",
    avgRating: 4.8,
    description: "A rich and complex single malt with notes of honey, heather, and subtle maritime influences. The palate reveals layers of fruit, oak, and gentle spice.",
    flavorProfile: ["Honey", "Heather", "Oak", "Maritime", "Fruit"],
    history: "Distilled in one of Scotland's oldest highland distilleries, established in 1826."
  },
  {
    id: "kyoto-artisan-whisky",
    name: "Kyoto Artisan Whisky",
    type: "Whiskey",
    region: "Japan",
    imageSrc: "https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg",
    avgRating: 4.7,
    description: "A masterfully crafted Japanese whisky combining traditional Scottish methods with Japanese precision. Delivers elegant floral notes with a hint of mizunara oak.",
    flavorProfile: ["Floral", "Mizunara Oak", "Sandalwood", "Green Tea", "Honey"],
    history: "Crafted in Kyoto using traditional Japanese craftsmanship dating back to the 1920s."
  },
  {
    id: "caribbean-aged-rum",
    name: "Caribbean Aged Rum",
    type: "Rum",
    region: "Caribbean",
    imageSrc: "https://images.pexels.com/photos/3407622/pexels-photo-3407622.jpeg",
    avgRating: 4.5,
    description: "A premium aged rum with rich notes of tropical fruits, vanilla, and warm spices. The long aging process in oak barrels imparts a smooth, complex character.",
    flavorProfile: ["Tropical Fruit", "Vanilla", "Oak", "Spice", "Caramel"],
    history: "Aged in the Caribbean where the tropical climate accelerates the maturation process."
  },
  {
    id: "london-dry-gin",
    name: "London Dry Gin",
    type: "Gin",
    region: "England",
    imageSrc: "https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg",
    avgRating: 4.6,
    description: "A classic London Dry Gin with prominent juniper notes balanced by citrus and botanical complexity. Crystal clear with a smooth, crisp finish.",
    flavorProfile: ["Juniper", "Citrus", "Coriander", "Angelica", "Orris Root"],
    history: "Crafted using traditional copper pot stills in the heart of London."
  },
  {
    id: "extra-anejo-tequila",
    name: "Extra Añejo Tequila",
    type: "Tequila",
    region: "Mexico",
    imageSrc: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg",
    avgRating: 4.9,
    description: "An ultra-premium tequila aged for over three years in oak barrels. Complex notes of agave, vanilla, and dark chocolate create an extraordinary sipping experience.",
    flavorProfile: ["Agave", "Vanilla", "Oak", "Chocolate", "Caramel"],
    history: "Produced in the highlands of Jalisco from 100% blue weber agave."
  },
  {
    id: "vsop-cognac",
    name: "VSOP Cognac",
    type: "Brandy",
    region: "France",
    imageSrc: "https://images.pexels.com/photos/3858347/pexels-photo-3858347.jpeg",
    avgRating: 4.7,
    description: "A harmonious VSOP cognac with elegant notes of dried fruits, vanilla, and subtle oak. The palate offers a perfect balance of fruit and wood.",
    flavorProfile: ["Dried Fruit", "Vanilla", "Oak", "Spice", "Floral"],
    history: "Aged in French oak barrels in the Cognac region for at least 4 years."
  },
  {
    id: "kentucky-bourbon",
    name: "Kentucky Straight Bourbon",
    type: "Whiskey",
    region: "USA",
    imageSrc: "https://images.pexels.com/photos/2531735/pexels-photo-2531735.jpeg",
    avgRating: 4.6,
    description: "A robust Kentucky bourbon with rich notes of vanilla, caramel, and charred oak. The high corn content creates a naturally sweet and full-bodied whiskey.",
    flavorProfile: ["Vanilla", "Caramel", "Oak", "Corn", "Spice"],
    history: "Distilled and aged in new charred oak barrels in Kentucky."
  },
  {
    id: "islay-single-malt",
    name: "Islay Single Malt",
    type: "Whiskey",
    region: "Scotland",
    imageSrc: "https://images.pexels.com/photos/2796105/pexels-photo-2796105.jpeg",
    avgRating: 4.8,
    description: "An intensely peated Islay malt with powerful smoke, seaweed, and medicinal notes. The palate offers complex layers of peat, brine, and sweet maltiness.",
    flavorProfile: ["Peat", "Smoke", "Seaweed", "Iodine", "Malt"],
    history: "Produced on the isle of Islay using traditional floor malting techniques."
  },
  {
    id: "premium-vodka",
    name: "Premium Wheat Vodka",
    type: "Vodka",
    region: "Russia",
    imageSrc: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg",
    avgRating: 4.4,
    description: "A smooth, premium vodka distilled from the finest winter wheat. Multiple distillations and careful filtration create an exceptionally clean taste.",
    flavorProfile: ["Wheat", "Mineral", "Subtle Sweet", "Clean", "Smooth"],
    history: "Produced using traditional Russian distillation methods dating back centuries."
  },
  {
    id: "jamaican-rum",
    name: "Jamaican Dark Rum",
    type: "Rum",
    region: "Caribbean",
    imageSrc: "https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg",
    avgRating: 4.6,
    description: "A full-bodied Jamaican rum with distinctive funky notes, tropical fruits, and rich molasses. Long fermentation creates complex esters and unique character.",
    flavorProfile: ["Tropical Fruit", "Molasses", "Funk", "Spice", "Oak"],
    history: "Produced using traditional pot stills and long fermentation periods unique to Jamaica."
  }
];

export const spiritTypes = Array.from(new Set(mockSpirits.map(spirit => spirit.type)));
export const spiritRegions = Array.from(new Set(mockSpirits.map(spirit => spirit.region)));