export interface SpiritSubtype {
  id: string;
  name: string;
  description: string;
  image: string;
  details: {
    characteristics: string[];
    tastingNotes: string;
    history: string;
    productionMethod: string;
    funFacts?: string[];
    myths?: string[];
    stats?: {
      abv: string;
      origin: string;
      category: string;
    };
  };
}

export interface SpiritCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  subtypes: SpiritSubtype[];
}