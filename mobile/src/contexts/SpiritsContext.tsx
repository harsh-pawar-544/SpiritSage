import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface AlcoholType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  history: string;
  fun_facts: string[];
  myths: string[];
  subtypes?: Subtype[];
}

interface Subtype {
  id: string;
  alcohol_type_id: string;
  name: string;
  description: string;
  region: string;
  image_url: string;
  abv_min: number;
  abv_max: number;
  flavor_profile: string[];
  characteristics: string[];
  production_method: string;
  history: string;
  fun_facts: string[];
  myths: string[];
  brands?: Brand[];
}

interface Brand {
  id: string;
  subtype_id: string;
  name: string;
  description: string;
  image_url: string;
  abv: number;
  tasting_notes: string[];
  price_range: string;
  history: string;
  fun_facts: string[];
  myths: string[];
}

interface SpiritsContextType {
  alcoholTypes: AlcoholType[];
  loading: boolean;
  error: string | null;
  getAlcoholTypeById: (id: string) => Promise<AlcoholType | undefined>;
  getSubtypeById: (id: string) => Promise<Subtype | undefined>;
  getBrandById: (id: string) => Promise<Brand | undefined>;
  getSubtypesByAlcoholTypeId: (alcoholTypeId: string) => Promise<Subtype[]>;
  getBrandsBySubtypeId: (subtypeId: string) => Promise<Brand[]>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlcoholTypes();
  }, []);

  const fetchAlcoholTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*');

      if (error) throw error;
      setAlcoholTypes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAlcoholTypeById = useCallback(async (id: string): Promise<AlcoholType | undefined> => {
    try {
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching alcohol type:', err);
      return undefined;
    }
  }, []);

  const getSubtypeById = useCallback(async (id: string): Promise<Subtype | undefined> => {
    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching subtype:', err);
      return undefined;
    }
  }, []);

  const getBrandById = useCallback(async (id: string): Promise<Brand | undefined> => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching brand:', err);
      return undefined;
    }
  }, []);

  const getSubtypesByAlcoholTypeId = useCallback(async (alcoholTypeId: string): Promise<Subtype[]> => {
    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select('*')
        .eq('alcohol_type_id', alcoholTypeId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching subtypes:', err);
      return [];
    }
  }, []);

  const getBrandsBySubtypeId = useCallback(async (subtypeId: string): Promise<Brand[]> => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('subtype_id', subtypeId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching brands:', err);
      return [];
    }
  }, []);

  const value = {
    alcoholTypes,
    loading,
    error,
    getAlcoholTypeById,
    getSubtypeById,
    getBrandById,
    getSubtypesByAlcoholTypeId,
    getBrandsBySubtypeId,
  };

  return (
    <SpiritsContext.Provider value={value}>
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