import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SpiritCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  subtypes: SpiritSubtype[];
}

interface SpiritSubtype {
  id: string;
  name: string;
  description: string;
  image: string;
  details: {
    characteristics: string[];
    tastingNotes: string;
    history: string;
    productionMethod: string;
    stats?: {
      abv: string;
      origin: string;
      category: string;
    };
  };
}

interface SpiritsContextType {
  categories: SpiritCategory[];
  loading: boolean;
  error: string | null;
  getSpirit: (id: string) => SpiritSubtype | undefined;
  getSubtypesByCategory: (categoryId: string) => Promise<SpiritSubtype[]>;
  getRatingsForSpirit: (spiritId: string) => Promise<any[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<SpiritCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('alcohol_types')
          .select('*');

        if (categoriesError) throw categoriesError;

        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*');

        if (subtypesError) throw subtypesError;

        const categoriesWithSubtypes = categoriesData.map((category: any) => ({
          ...category,
          subtypes: subtypesData.filter((subtype: any) => 
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

    fetchCategories();
  }, []);

  const getSpirit = (id: string) => {
    return categories
      .flatMap(category => category.subtypes)
      .find(spirit => spirit.id === id);
  };

  const getSubtypesByCategory = async (categoryId: string) => {
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

  return (
    <SpiritsContext.Provider value={{
      categories,
      loading,
      error,
      getSpirit,
      getSubtypesByCategory,
      getRatingsForSpirit,
      addRating
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