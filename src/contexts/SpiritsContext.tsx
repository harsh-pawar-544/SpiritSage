import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type SpiritCategory = Database['public']['Tables']['spirit_categories']['Row'];
type SpiritSubtype = Database['public']['Tables']['spirit_subtypes']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];

interface SpiritsContextType {
  getCategories: () => Promise<SpiritCategory[]>;
  getSubtypesByCategory: (categoryId: string) => Promise<SpiritSubtype[]>;
  getSubtypeById: (id: string) => Promise<SpiritSubtype | null>;
  getRatings: (spiritId: string) => Promise<Rating[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: ReactNode }) {
  const getCategories = async () => {
    const { data, error } = await supabase
      .from('spirit_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  };

  const getSubtypesByCategory = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('spirit_subtypes')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) throw error;
    return data;
  };

  const getSubtypeById = async (id: string) => {
    const { data, error } = await supabase
      .from('spirit_subtypes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  const getRatings = async (spiritId: string) => {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('spirit_id', spiritId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const addRating = async (spiritId: string, rating: number, comment: string) => {
    const { error } = await supabase
      .from('ratings')
      .insert({
        spirit_id: spiritId,
        rating,
        comment,
        user_id: 'anonymous', // Replace with actual user ID when auth is implemented
      });
    
    if (error) throw error;
  };

  return (
    <SpiritsContext.Provider value={{
      getCategories,
      getSubtypesByCategory,
      getSubtypeById,
      getRatings,
      addRating,
    }}>
      {children}
    </SpiritsContext.Provider>
  );
}

export function useSpirits() {
  const context = useContext(SpiritsContext);
  if (context === undefined) {
    throw new Error('useSpirits must be used within a SpiritsProvider');
  }
  return context;
}