import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface SpiritCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: string;
}

interface SpiritSubtype {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
  region: string;
  characteristics: string[];
  production_method: string;
  created_at: string;
}

interface SpiritsContextType {
  getCategories: () => Promise<SpiritCategory[]>;
  getCategoryById: (id: string) => Promise<SpiritCategory | null>;
  getSubtypesByCategory: (categoryId: string) => Promise<SpiritSubtype[]>;
  getSubtypeById: (id: string) => Promise<SpiritSubtype | null>;
  getRatingsForSpirit: (spiritId: string) => Promise<any[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: ReactNode }) {
  const getCategories = async () => {
    const { data, error } = await supabase
      .from('alcohol_types')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  };

  const getCategoryById = async (id: string) => {
    const { data, error } = await supabase
      .from('alcohol_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  const getSubtypesByCategory = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('subtypes')
      .select(`
        *,
        alcohol_types (
          name
        )
      `)
      .eq('alcohol_type_id', categoryId)
      .order('name');
    
    if (error) throw error;
    return data;
  };

  const getSubtypeById = async (id: string) => {
    const { data, error } = await supabase
      .from('subtypes')
      .select(`
        *,
        alcohol_types (
          name,
          description
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  const getRatingsForSpirit = async (spiritId: string) => {
    const { data, error } = await supabase
      .from('ratings')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
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
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) throw error;
  };

  return (
    <SpiritsContext.Provider value={{
      getCategories,
      getCategoryById,
      getSubtypesByCategory,
      getSubtypeById,
      getRatingsForSpirit,
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