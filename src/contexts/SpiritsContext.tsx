// src/contexts/SpiritsContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct! '../lib/supabase' or '../lib/supabaseClient'

// Define interfaces based on your EXACT Supabase table structures
interface AlcoholType {
  id: string;
  name: string;
  history: string | null;
  fun_facts: string | null;
  image_url: string | null; // Assumes you will add this column in Supabase
  image?: string | null; // For mapping image_url to image property for components
  created_at: string;
  updated_at: string;
}

interface Subtype {
  id: string;
  alcohol_type_id: string;
  name: string;
  region: string | null;
  description: string | null;
  abv_min: number | null;
  abv_max: number | null;
  flavor_profile: string[] | null;
  characteristics: string[] | null;
  production_method: string | null;
  image_url: string | null; // Assumes you will add this column in Supabase
  image?: string | null; // For mapping image_url to image property for components
  created_at: string;
  updated_at: string;
}

interface Brand { // Renamed from Spirit to Brand to match your 'brands' table
  id: string;
  subtype_id: string;
  name: string;
  description: string | null;
  abv: number | null;
  tasting_notes: string[] | null; // _text in Supabase maps to string[] in TS
  price_range: string | null;
  image_url: string | null; // Assumes you will add this column in Supabase
  image?: string | null; // For mapping image_url to image property for components
  created_at: string;
  updated_at: string;
  avg_rating?: number | null; // Add if you store this directly or calculate it
}

interface Rating {
  id: string;
  spirit_id: string; // Should be uuid in Supabase to match brands.id
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { // This matches your Supabase query for joining profiles
    username: string;
    avatar_url: string | null;
  };
}

// Define the shape of your context value
interface SpiritsContextType {
  alcoholTypes: AlcoholType[];
  loading: boolean;
  error: string | null;
  getCategoryById: (id: string) => Promise<AlcoholType | null>;
  getSubtypesByCategoryId: (categoryId: string) => Promise<Subtype[]>;
  getBrandsBySubtypeId: (subtypeId: string) => Promise<Brand[]>; // Renamed
  getBrandById: (brandId: string) => Promise<Brand | null>; // Renamed
  addRating: (brandId: string, rating: number, comment: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => Promise<Rating[]>; // Renamed
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all main alcohol types (for SpiritListPage/ExplorePage)
  useEffect(() => {
    const fetchAllAlcoholTypes = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('alcohol_types') // Your main categories table name
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch alcohol types.');
        }
        // Map image_url to image for compatibility with existing components
        const mappedData = data?.map(item => ({ ...item, image: item.image_url })) || [];
        setAlcoholTypes(mappedData);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching alcohol types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAlcoholTypes();
  }, []);

  // Function to get a single category by ID (for SpiritOverviewPage)
  const getCategoryById = useCallback(
    async (id: string): Promise<AlcoholType | null> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('alcohol_types')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw new Error(fetchError.message || 'Failed to fetch category.');
        }
        return data ? { ...data, image: data.image_url } as AlcoholType : null;
      } catch (err) {
        console.error('Error fetching category by ID:', err);
        return null;
      }
    },
    []
  );

  // Function to get subtypes for a given alcohol category ID (for SpiritSubtypesPage)
  const getSubtypesByCategoryId = useCallback(
    async (categoryId: string): Promise<Subtype[]> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('subtypes') // Your subtypes table name
          .select('*')
          .eq('alcohol_type_id', categoryId)
          .order('name', { ascending: true });

        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch subtypes.');
        }
        return data?.map(item => ({ ...item, image: item.image_url })) || [];
      } catch (err) {
        console.error('Error fetching subtypes by category ID:', err);
        return [];
      }
    },
    []
  );

  // Function to get individual brands for a given subtype ID (for SpiritsBySubtypePage)
  const getBrandsBySubtypeId = useCallback(
    async (subtypeId: string): Promise<Brand[]> => { // Renamed
      try {
        const { data, error: fetchError } = await supabase
          .from('brands') // Changed from 'spirits' to 'brands'
          .select('*')
          .eq('subtype_id', subtypeId)
          .order('name', { ascending: true });

        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch brands by subtype.');
        }
        return data?.map(item => ({ ...item, image: item.image_url })) || [];
      } catch (err) {
        console.error('Error fetching brands by subtype ID:', err);
        return [];
      }
    },
    []
  );

  // Function to get a single brand by ID (for SpiritProfilePage)
  const getBrandById = useCallback( // Renamed
    async (brandId: string): Promise<Brand | null> => { // Renamed
      try {
        const { data, error: fetchError } = await supabase
          .from('brands') // Changed from 'spirits' to 'brands'
          .select('*')
          .eq('id', brandId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw new Error(fetchError.message || 'Failed to fetch brand.');
        }
        return data ? { ...data, image: data.image_url } as Brand : null; // Changed to Brand
      } catch (err) {
        console.error('Error fetching brand by ID:', err);
        return null;
      }
    },
    []
  );

  // Function to add a rating
  const addRating = useCallback(
    async (brandId: string, rating: number, comment: string): Promise<void> => { // Changed spiritId to brandId
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to rate');

      const { error: insertError } = await supabase
        .from('ratings')
        .insert({
          spirit_id: brandId, // This column name in 'ratings' table is 'spirit_id'
          user_id: user.id,
          rating,
          comment,
        });

      if (insertError) {
        throw new Error(insertError.message || 'Failed to add rating.');
      }
    },
    []
  );

  // Function to get ratings for a brand
  const getRatingsForBrand = useCallback( // Renamed
    async (brandId: string): Promise<Rating[]> => { // Renamed
      try {
        const { data, error: fetchError } = await supabase
          .from('ratings')
          .select(`
            *,
            profiles:user_id ( // This assumes a 'profiles' table with 'id' column linked to auth.users.id via user_id
              username,
              avatar_url
            )
          `)
          .eq('spirit_id', brandId) // Changed spiritId to brandId
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch ratings.');
        }
        return data || [];
      } catch (err) {
        console.error('Error fetching ratings:', err);
        return [];
      }
    },
    []
  );

  const contextValue = {
    alcoholTypes,
    loading,
    error,
    getCategoryById,
    getSubtypesByCategoryId,
    getBrandsBySubtypeId, // Renamed
    getBrandById, // Renamed
    addRating,
    getRatingsForBrand, // Renamed
  };

  return (
    <SpiritsContext.Provider value={contextValue}>
      {children}
    </SpiritsContext.Provider>
  );
};

export const useSpirits = () => {
  const context = useContext(SpiritsContext);
  if (context === undefined) {
    throw new Error('useSpirits must be used within a SpiritsProvider');
  }
  return context;
};