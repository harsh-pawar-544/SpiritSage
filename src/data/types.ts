// src/data/types.ts

// Forward declarations for interfaces that reference each other
// This helps TypeScript resolve circular dependencies in interfaces
// if you were to strictly type all nested arrays (e.g., AlcoholType has Subtype[], Subtype has Brand[])
// For this simple case, direct definition should be fine, but it's good practice.

// --- AlcoholType Interface ---
// Represents the top-level alcohol categories (e.g., "Whisky", "Vodka")
export interface AlcoholType {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null; // The URL directly from the database

  // Optional: If you preprocess and attach a display-ready image property
  image?: string | null; // A convenient property for components, often derived from image_url

  // Detailed content fields for the category page
  history: string | null;
  fun_facts: string[] | null;
  myths: string[] | null;

  // Nested Subtypes: When fetching AlcoholType data with its related subtypes
  subtypes?: Subtype[]; // An array of associated Subtype objects
}

// --- Subtype Interface ---
// Represents a specific type of alcohol within a category (e.g., "Scotch Whisky", "Irish Whiskey")
export interface Subtype {
  id: string;
  alcohol_type_id: string; // Foreign key linking back to AlcoholType

  name: string;
  description: string | null;
  image_url: string | null; // The URL directly from the database
  alcohol_type_name?: string | null; // Add this
  // Optional: If you preprocess and attach a display-ready image property
  image?: string | null; // A convenient property for components, often derived from image_url

  // Detailed content fields for the subtype page
  region: string | null;
  abv_min: number | null;
  abv_max: number | null;
  flavor_profile: string[] | null;
  characteristics: string[] | null;
  production_method: string | null;
  history: string | null;
  fun_facts: string[] | null;
  myths: string[] | null;

  // IMPORTANT: This property is for the *parent AlcoholType's name and ID*
  // It's used when you fetch a Subtype and want to know its parent category's details
  // This matches the `{ id: string; name: string } | null` structure we decided to return in getSubtypeById
  alcohol_types?: { id: string; name: string } | null; // Matches the joined data structure

  // Nested Brands: When fetching Subtype data with its related brands
  brands?: Brand[]; // An array of associated Brand objects
}

// --- Brand Interface ---
// Represents an individual spirit brand (e.g., "Johnnie Walker Black Label")
export interface Brand {
  id: string;
  subtype_id: string; // Foreign key linking back to Subtype

  name: string;
  description: string | null;
  abv: number | null; // Alcohol by Volume (e.g., 40)
  tasting_notes: string[] | null;
  price_range: string | null;
  image_url: string | null; // The URL directly from the database
  subtype_id: string; // Add this
  subtype_name?: string | null; // Add this
  alcohol_type_id: string; // Add this
  alcohol_type_name?: string | null; // Add this

  // Optional: If you preprocess and attach a display-ready image property
  image?: string | null; // A convenient property for components, often derived from image_url

  // Detailed content fields for the brand page
  history: string | null;
  fun_facts: string[] | null;
  myths: string[] | null;

  // Derived/joined parent information for display or navigation
  // This is used when you fetch a Brand and need to know its parent subtype/alcohol type
  subtypes?: { // Nested object for parent subtype's details
    id: string; // Include ID for accurate linking
    name: string;
    alcohol_types?: { // Nested object for parent alcohol type's details
      id: string; // Include ID for accurate linking
      name: string;
    } | null;
  } | null;

  // You might want to include 'origin' if it's a direct column on 'brands'
  // origin?: string | null;
}

// --- Rating Interface ---
// Represents a user's rating and comment for a spirit brand
export interface Rating {
  id: string;
  spirit_id: string; // Should be uuid from 'brands.id'
  user_id: string;
  rating: number; // e.g., 1-5 stars
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { // If you join user profile data with the rating
    username: string;
    avatar_url: string | null;
  };
}