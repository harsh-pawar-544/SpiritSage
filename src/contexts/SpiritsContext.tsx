import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { mockSpirits } from '../data/mockSpirits';

interface Spirit {
  id: string;
  name: string;
  type: string;
  subtype?: string;
  brand?: string;
  description: string;
  abv?: number;
  tasting_notes?: string[];
  price_range?: string;
  image_url?: string;
  history?: string;
  fun_facts?: string[];
  myths?: string[];
}

interface SpiritsContextType {
  spirits: Spirit[];
  alcoholTypes: any[];
  subtypes: any[];
  brands: any[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  refreshData: () => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const useSpirits = () => {
  const context = useContext(SpiritsContext);
  if (context === undefined) {
    throw new Error('useSpirits must be used within a SpiritsProvider');
  }
  return context;
};

export const SpiritsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [alcoholTypes, setAlcoholTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchAlcoholTypes = async () => {
    if (!supabase) {
      console.log('Using mock alcohol types data');
      return [
        { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash' },
        { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage' },
        { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane' },
        { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries' },
        { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant' }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('alcohol_types')
        .select('*')
        .order('name');

      if (error) {
        console.warn('Error fetching alcohol types:', error.message);
        setIsOffline(true);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn('Error loading alcohol types:', err);
      setIsOffline(true);
      return [];
    }
  };

  const fetchSubtypes = async () => {
    if (!supabase) {
      console.log('Using mock subtypes data');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('subtypes')
        .select(`
          *,
          alcohol_types (
            id,
            name
          )
        `)
        .order('name');

      if (error) {
        console.warn('Error fetching subtypes:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn('Error loading subtypes:', err);
      return [];
    }
  };

  const fetchBrands = async () => {
    if (!supabase) {
      console.log('Using mock brands data');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('brands')
        .select(`
          *,
          subtypes (
            id,
            name,
            alcohol_types (
              id,
              name
            )
          )
        `)
        .order('name');

      if (error) {
        console.warn('Error fetching brands:', error.message);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn('Error loading brands:', err);
      return [];
    }
  };

  const fetchMyBarSpirits = async () => {
    if (!supabase) {
      console.log('Using mock My Bar spirits data');
      return [];
    }

    try {
      // For now, return empty array since we don't have user authentication
      return [];
    } catch (err) {
      console.warn('Error loading My Bar spirits:', err);
      return [];
    }
  };

  const fetchAllSpiritsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable();
      
      if (!supabaseAvailable) {
        console.log('Supabase not available, using mock data');
        setIsOffline(true);
        setSpirits(mockSpirits);
        setAlcoholTypes([
          { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash' },
          { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage' },
          { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane' },
          { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries' },
          { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant' }
        ]);
        setSubtypes([]);
        setBrands([]);
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [alcoholTypesData, subtypesData, brandsData, myBarSpiritsData] = await Promise.all([
        fetchAlcoholTypes(),
        fetchSubtypes(),
        fetchBrands(),
        fetchMyBarSpirits()
      ]);

      setAlcoholTypes(alcoholTypesData);
      setSubtypes(subtypesData);
      setBrands(brandsData);

      // Combine all spirits data
      const allSpirits: Spirit[] = [
        ...alcoholTypesData.map((type: any) => ({
          id: `alcohol_type_${type.id}`,
          name: type.name,
          type: 'alcohol_type',
          description: type.description,
          history: type.history,
          fun_facts: type.fun_facts,
          myths: type.myths,
          image_url: type.image_url
        })),
        ...subtypesData.map((subtype: any) => ({
          id: `subtype_${subtype.id}`,
          name: subtype.name,
          type: 'subtype',
          subtype: subtype.alcohol_types?.name,
          description: subtype.description,
          abv: subtype.abv_min ? `${subtype.abv_min}${subtype.abv_max ? `-${subtype.abv_max}` : '+'}%` : undefined,
          tasting_notes: subtype.flavor_profile,
          history: subtype.history,
          fun_facts: subtype.fun_facts,
          myths: subtype.myths,
          image_url: subtype.image_url
        })),
        ...brandsData.map((brand: any) => ({
          id: `brand_${brand.id}`,
          name: brand.name,
          type: 'brand',
          brand: brand.name,
          subtype: brand.subtypes?.name,
          description: brand.description,
          abv: brand.abv ? `${brand.abv}%` : undefined,
          tasting_notes: brand.tasting_notes,
          price_range: brand.price_range,
          history: brand.history,
          fun_facts: brand.fun_facts,
          myths: brand.myths,
          image_url: brand.image_url
        }))
      ];

      setSpirits(allSpirits);
      setIsOffline(false);
    } catch (err) {
      console.error('Error fetching spirits data:', err);
      setError('Failed to load spirits data. Using offline mode.');
      setIsOffline(true);
      
      // Fallback to mock data
      setSpirits(mockSpirits);
      setAlcoholTypes([
        { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash' },
        { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage' },
        { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane' },
        { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries' },
        { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant' }
      ]);
      setSubtypes([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAllSpiritsData();
  };

  useEffect(() => {
    fetchAllSpiritsData();
  }, []);

  const value: SpiritsContextType = {
    spirits,
    alcoholTypes,
    subtypes,
    brands,
    loading,
    error,
    isOffline,
    refreshData
  };

  return (
    <SpiritsContext.Provider value={value}>
      {children}
    </SpiritsContext.Provider>
  );
};