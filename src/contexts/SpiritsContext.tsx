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

interface FilterOptions {
  types: string[];
  subtypes: string[];
  brands: string[];
  priceRanges: string[];
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
  getAvailableFilterOptions: () => FilterOptions;
  getFilteredSpirits: (filters: any) => Spirit[];
  addSpiritToMyBar: (spiritId: string, spiritType: string, notes?: string) => Promise<void>;
  isInMyBar: (spiritId: string, spiritType: string) => boolean;
  loadMyBarSpirits: () => Promise<void>;
  addRating: (spiritId: string, rating: number, comment?: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => any[];
  getTastingNotesForSpirit: (spiritId: string) => string[];
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
  const [myBarSpirits, setMyBarSpirits] = useState<any[]>([]);

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
      setMyBarSpirits(myBarSpiritsData);

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

  // Filter and utility functions
  const getAvailableFilterOptions = (): FilterOptions => {
    const types = [...new Set(spirits.map(spirit => spirit.type))];
    const subtypes = [...new Set(spirits.map(spirit => spirit.subtype).filter(Boolean))];
    const brands = [...new Set(spirits.map(spirit => spirit.brand).filter(Boolean))];
    const priceRanges = [...new Set(spirits.map(spirit => spirit.price_range).filter(Boolean))];

    return {
      types,
      subtypes,
      brands,
      priceRanges
    };
  };

  const getFilteredSpirits = (filters: any): Spirit[] => {
    if (!filters) return spirits;

    return spirits.filter(spirit => {
      if (filters.type && spirit.type !== filters.type) return false;
      if (filters.subtype && spirit.subtype !== filters.subtype) return false;
      if (filters.brand && spirit.brand !== filters.brand) return false;
      if (filters.priceRange && spirit.price_range !== filters.priceRange) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return spirit.name.toLowerCase().includes(searchTerm) ||
               spirit.description.toLowerCase().includes(searchTerm);
      }
      return true;
    });
  };

  const addSpiritToMyBar = async (spiritId: string, spiritType: string, notes?: string): Promise<void> => {
    if (!supabase) {
      console.log('Cannot add to My Bar - Supabase not available');
      return;
    }

    try {
      // This would require user authentication
      console.log('Adding spirit to My Bar:', { spiritId, spiritType, notes });
      // Implementation would go here when user auth is available
    } catch (err) {
      console.error('Error adding spirit to My Bar:', err);
    }
  };

  const isInMyBar = (spiritId: string, spiritType: string): boolean => {
    return myBarSpirits.some(spirit => 
      spirit.spirit_id === spiritId && spirit.spirit_type === spiritType
    );
  };

  const loadMyBarSpirits = async (): Promise<void> => {
    const myBarData = await fetchMyBarSpirits();
    setMyBarSpirits(myBarData);
  };

  const addRating = async (spiritId: string, rating: number, comment?: string): Promise<void> => {
    if (!supabase) {
      console.log('Cannot add rating - Supabase not available');
      return;
    }

    try {
      // This would require user authentication
      console.log('Adding rating:', { spiritId, rating, comment });
      // Implementation would go here when user auth is available
    } catch (err) {
      console.error('Error adding rating:', err);
    }
  };

  const getRatingsForBrand = (brandId: string): any[] => {
    // Return empty array for now - would fetch from database when available
    return [];
  };

  const getTastingNotesForSpirit = (spiritId: string): string[] => {
    const spirit = spirits.find(s => s.id === spiritId);
    return spirit?.tasting_notes || [];
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
    refreshData,
    getAvailableFilterOptions,
    getFilteredSpirits,
    addSpiritToMyBar,
    isInMyBar,
    loadMyBarSpirits,
    addRating,
    getRatingsForBrand,
    getTastingNotesForSpirit
  };

  return (
    <SpiritsContext.Provider value={value}>
      {children}
    </SpiritsContext.Provider>
  );
};