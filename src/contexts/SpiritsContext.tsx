import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SpiritCategory {
  id: string;
  name: string;
  description: string;
  history: string;
  fun_facts: string[];
  created_at: string;
  updated_at: string;
  subtypes: SpiritSubtype[];
}

interface SpiritSubtype {
  id: string;
  alcohol_type_id: string;
  name: string;
  region: string;
  description: string;
  abv_min: number;
  abv_max: number;
  flavor_profile: string[];
  characteristics: string[];
  production_method: string;
  created_at: string;
  updated_at: string;
}

interface TastingNote {
  term: string;
  percentage: number;
}

interface SpiritsContextType {
  categories: SpiritCategory[];
  loading: boolean;
  error: string | null;
  getCategoryById: (id: string) => SpiritCategory | undefined;
  getSubtypesByCategory: (categoryId: string) => SpiritSubtype[];
  getRatingsForSpirit: (spiritId: string) => Promise<any[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<TastingNote[]>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<SpiritCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpirits() {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('alcohol_types')
          .select('*');

        if (categoriesError) throw categoriesError;

        // Fetch subtypes
        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*');

        if (subtypesError) throw subtypesError;

        // Combine categories with their subtypes
        const categoriesWithSubtypes = categoriesData.map((category: SpiritCategory) => ({
          ...category,
          subtypes: subtypesData.filter((subtype: SpiritSubtype) => 
            subtype.alcohol_type_id === category.id
          )
        }));

        setCategories(categoriesWithSubtypes);
      } catch (err) {
        console.error('Error fetching spirits:', err);
        setError(err instanceof Error ? err.message : 'Failed to load spirits');
      } finally {
        setLoading(false);
      }
    }

    fetchSpirits();
  }, []);

  const getCategoryById = (id: string) => {
    return categories.find(category => category.id === id);
  };

  const getSubtypesByCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subtypes || [];
  };

  const getRatingsForSpirit = async (spiritId: string) => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('spirit_id', spiritId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching ratings:', err);
      return [];
    }
  };

  const addRating = async (spiritId: string, rating: number, comment: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to rate');

    const { error } = await supabase
      .from('ratings')
      .insert({
        spirit_id: spiritId,
        user_id: user.id,
        rating,
        comment
      });

    if (error) throw error;
  };

  const getTastingNotesForSpirit = async (spiritId: string): Promise<TastingNote[]> => {
    try {
      // Find the subtype that matches the spirit ID
      const subtype = categories.flatMap(cat => cat.subtypes).find(sub => sub.id === spiritId);
      
      if (!subtype) {
        return [];
      }

      // Convert flavor profile array to TastingNote array with mock percentages
      return subtype.flavor_profile.map((flavor, index) => ({
        term: flavor,
        // Generate a random percentage between 40 and 95 for demonstration
        percentage: Math.floor(95 - (index * 10))
      }));
    } catch (err) {
      console.error('Error getting tasting notes:', err);
      return [];
    }
  };

  return (
    <SpiritsContext.Provider value={{
      categories,
      loading,
      error,
      getCategoryById,
      getSubtypesByCategory,
      getRatingsForSpirit,
      addRating,
      getTastingNotesForSpirit
    }}>
      {children}
    </SpiritsContext.Provider>
  );
}

export function useSpirits() {
  const context = useContext(SpiritsContext);
  if (!context) {
    throw new Error('useSpirits must be used within SpiritsProvider');
  }
  return context;
}