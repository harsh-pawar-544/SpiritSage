// src/data/types.ts

// The Brand interface
export interface Brand {
  id: string;
  subtype_id: string; // Foreign key
  name: string;
  description: string | null;
  abv: number | null; // Assumed from PDF's "Typical ABV" for individual products
  tasting_notes: string[] | null; // Assumed from PDF's "Tasting Notes" column, if added and is array
  price_range: string | null; // Assumed from PDF's "Price Range" if exists
  image_url: string | null; // This is the single source of truth for the image URL

  // These should correspond to columns in your 'brands' table, or be derived
  // from nested joins (e.g., subtype details for category/origin)
  history: string | null;
  fun_facts: string[] | null; // Assuming this is an array if multi-valued
  myths: string[] | null; // Assuming this is an array if multi-valued

  // Derived from joins, or direct column if you have it
  origin?: string | null; // From subtype or brand directly
  category_name?: string | null; // From alcohol_types through subtypes
  // ... any other columns specific to your 'brands' table
}

// Updated Subtype interface to include detailed content
export interface Subtype {
  id: string;
  alcohol_type_id: string; // Foreign key
  name: string;
  description: string | null;
  image_url: string | null; // This is the single source of truth for the image URL

  // Details fields, matching what you want to display for a subtype
  region: string | null; // From PDF's Country/Region
  abv_min: number | null; // From PDF's Typical ABV range
  abv_max: number | null; // From PDF's Typical ABV range
  flavor_profile: string[] | null; // Assuming this is an array of strings
  characteristics: string[] | null; // Assuming this is an array of strings
  production_method: string | null;
  history: string | null;
  fun_facts: string[] | null;
  myths: string[] | null;
  
  // For nested data from joins, if you need these
  alcohol_types?: { name: string } | null; // For 'alcohol_types(name)' join

  // If you also want nested brands inside the subtype object (for listing)
  brands?: Brand[];
}

// Updated AlcoholType interface to include detailed content
export interface AlcoholType {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null; // This is the single source of truth for the image URL
  subtype: Subtype[]
  // Details fields, matching what you want to display for a parent category
  history: string | null;
  fun_facts: string[] | null;
  myths: string[] | null;

  // If you want nested subtypes inside the alcoholType object (for listing)
  subtypes?: Subtype[];
}

export interface Rating {
  id: string;
  spirit_id: string; // Should be uuid in Supabase to match brands.id
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}