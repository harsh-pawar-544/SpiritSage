import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Spirit {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  region: string;
  characteristics: string[];
  production_method: string;
  created_at: string;
}

interface SpiritsContextType {
  spirits: Spirit[];
  loading: boolean;
  error: string | null;
  getSpirit: (id: string) => Promise<Spirit | null>;
  getSpirits: () => Promise<Spirit[]>;
  getSubtypes: (categoryId: string) => Promise<Spirit[]>;
  addRating: (spiritId: string, rating: number, comment: string) => Promise<void>;
  getRatings: (spiritId: string) => Promise<any[]>;
  getCategoryById: (id: string) => Promise<any>;
  getSubtypesByCategory: (categoryId: string) => Promise<any[]>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export function SpiritsProvider({ children }: { children: React.ReactNode }) {
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpirits();
  }, []);

  async function fetchSpirits() {
    try {
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map image_url to image property
      const mappedData = data?.map(item => ({
        ...item,
        image: item.image_url
      })) || [];

      setSpirits(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spirits');
    } finally {
      setLoading(false);
    }
  }

  async function getSpirit(id: string) {
    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select(`
          *,
          alcohol_types (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        image: data.image_url
      };
    } catch (err) {
      console.error('Error fetching spirit:', err);
      return null;
    }
  }

  async function getCategoryById(id: string) {
    try {
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        image: data.image_url
      };
    } catch (err) {
      console.error('Error fetching category:', err);
      return null;
    }
  }

  async function getSubtypesByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select(`
          *,
          alcohol_types!inner (*)
        `)
        .eq('alcohol_type_id', categoryId)
        .order('name');

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        image: item.image_url
      })) || [];
    } catch (err) {
      console.error('Error fetching subtypes:', err);
      return [];
    }
  }

  async function getSpirits() {
    try {
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*')
        .order('name');

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        image: item.image_url
      })) || [];
    } catch (err) {
      console.error('Error fetching spirits:', err);
      return [];
    }
  }

  async function getSubtypes(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select('*')
        .eq('alcohol_type_id', categoryId)
        .order('name');

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        image: item.image_url
      })) || [];
    } catch (err) {
      console.error('Error fetching subtypes:', err);
      return [];
    }
  }

  async function addRating(spiritId: string, rating: number, comment: string) {
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
  }

  async function getRatings(spiritId: string) {
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
    return data || [];
  }

  return (
    <SpiritsContext.Provider value={{
      spirits,
      loading,
      error,
      getSpirit,
      getSpirits,
      getSubtypes,
      addRating,
      getRatings,
      getCategoryById,
      getSubtypesByCategory
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