import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type SpiritCategory = Database['public']['Tables']['alcohol_types']['Row'];
type SpiritSubtype = Database['public']['Tables']['subtypes']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];

interface SpiritsContextType {
  getCategories: () => Promise<SpiritCategory[]>;
  getSubtypesByCategory: (categoryId: string) => Promise<SpiritSubtype[]>;
  getSubtypeById: (id: string) => Promise<SpiritSubtype | null>;
  getRatings: () => Promise<Rating[]>;
  getRatingsForSpirit: (spiritId: string) => Promise<Rating[]>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<Array<{ term: string; percentage: number }>>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
  updateRating: (ratingId: string, rating: number, comment: string) => Promise<void>;
  deleteRating: (ratingId: string) => Promise<void>;
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

  const getSubtypesByCategory = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('subtypes')
      .select('*')
      .eq('alcohol_type_id', categoryId)
      .order('name');
    
    if (error) throw error;
    return data;
  };

  const getSubtypeById = async (id: string) => {
    const { data, error } = await supabase
      .from('subtypes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  const getRatings = async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const getRatingsForSpirit = async (spiritId: string) => {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('spirit_id', spiritId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const getTastingNotesForSpirit = async (spiritId: string) => {
    // For now, return mock data until we implement the actual tasting notes feature
    return [
      { term: 'Vanilla', percentage: 75 },
      { term: 'Oak', percentage: 65 },
      { term: 'Caramel', percentage: 60 },
      { term: 'Spice', percentage: 45 },
      { term: 'Fruit', percentage: 40 }
    ];
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

  const updateRating = async (ratingId: string, rating: number, comment: string) => {
    const { error } = await supabase
      .from('ratings')
      .update({ rating, comment, updated_at: new Date().toISOString() })
      .eq('id', ratingId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) throw error;
  };

  const deleteRating = async (ratingId: string) => {
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('id', ratingId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) throw error;
  };

  return (
    <SpiritsContext.Provider value={{
      getCategories,
      getSubtypesByCategory,
      getSubtypeById,
      getRatings,
      getRatingsForSpirit,
      getTastingNotesForSpirit,
      addRating,
      updateRating,
      deleteRating,
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