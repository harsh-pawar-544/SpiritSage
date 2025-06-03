import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { spiritCategories } from '../data/spiritCategories';

interface SpiritsContextType {
  categories: typeof spiritCategories;
  loading: boolean;
  error: string | null;
  getSpirit: (id: string) => any;
  getSubtypesByCategory: (categoryId: string) => Promise<any[]>;
  getRatingsForSpirit: (spiritId: string) => Promise<any[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getSpirit = (id: string) => {
    return spiritCategories
      .flatMap(category => category.subtypes)
      .find(spirit => spirit.id === id);
  };

  const getSubtypesByCategory = async (categoryId: string) => {
    const category = spiritCategories.find(cat => cat.id === categoryId);
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
      categories: spiritCategories,
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