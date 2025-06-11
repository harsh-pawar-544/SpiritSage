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
  abv?: string;
  alcohol_type_id?: string;
  subtype_id?: string;
  tasting_notes?: string[];
  price_range?: string;
  image_url?: string;
  history?: string;
  fun_facts?: string[];
  myths?: string[];
}

interface FilterOptions {
  alcoholTypes: Array<{id: string; name: string}>;
  subtypes: Array<{id: string; name: string}>;
  brands: Array<{id: string; name: string}>;
  priceRanges: string[];
  abvRanges: Array<{min: number; max: number; label: string}>;
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
  getCategoryById: (id: string) => Promise<any>;
  getSubtypesByCategoryId: (categoryId: string) => any[];
  getBrandsBySubtypeId: (subtypeId: string) => any[];
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
          image_url: type.image_url,
          alcohol_type_id: type.id
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
          image_url: subtype.image_url,
          alcohol_type_id: subtype.alcohol_type_id,
          subtype_id: subtype.id
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
          image_url: brand.image_url,
          alcohol_type_id: brand.subtypes?.alcohol_types?.id,
          subtype_id: brand.subtype_id
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
    const uniquePriceRanges = [...new Set(spirits.map(spirit => spirit.price_range).filter(Boolean))];
    
    const abvRanges = [
      { min: 0, max: 20, label: '0-20%' },
      { min: 20, max: 40, label: '20-40%' },
      { min: 40, max: 60, label: '40-60%' },
      { min: 60, max: 100, label: '60%+' }
    ];

    return {
      alcoholTypes: alcoholTypes.map(type => ({ id: type.id, name: type.name })),
      subtypes: subtypes.map(subtype => ({ id: subtype.id, name: subtype.name })),
      brands: brands.map(brand => ({ id: brand.id, name: brand.name })),
      priceRanges: uniquePriceRanges,
      abvRanges
    };
  };

  const getFilteredSpirits = (filters: any): Spirit[] => {
    if (!filters) return spirits;

    return spirits.filter(spirit => {
      // Filter by alcohol type IDs
      if (filters.alcoholTypeIds && filters.alcoholTypeIds.length > 0) {
        if (!filters.alcoholTypeIds.includes(spirit.alcohol_type_id)) return false;
      }

      // Filter by subtype IDs
      if (filters.subtypeIds && filters.subtypeIds.length > 0) {
        if (!filters.subtypeIds.includes(spirit.subtype_id)) return false;
      }

      // Filter by price ranges
      if (filters.priceRanges && filters.priceRanges.length > 0) {
        if (!spirit.price_range || !filters.priceRanges.includes(spirit.price_range)) return false;
      }

      // Filter by ABV range
      if (filters.abvRange) {
        if (!spirit.abv) return false;
        const abvValue = parseFloat(spirit.abv.replace('%', '').split('-')[0]);
        if (abvValue < filters.abvRange.min || abvValue > filters.abvRange.max) return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        return spirit.name.toLowerCase().includes(searchTerm) ||
               spirit.description.toLowerCase().includes(searchTerm);
      }

      return true;
    });
  };

  const getSubtypesByCategoryId = (categoryId: string): any[] => {
    return subtypes.filter(subtype => subtype.alcohol_type_id === categoryId);
  };

  const getBrandsBySubtypeId = (subtypeId: string): any[] => {
    return brands.filter(brand => brand.subtype_id === subtypeId);
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

  const getCategoryById = async (id: string): Promise<any> => {
    try {
      // First check if we have the alcohol type in our current state
      const alcoholType = alcoholTypes.find(type => type.id === id);
      if (alcoholType) {
        return {
          id: alcoholType.id,
          name: alcoholType.name,
          description: alcoholType.description,
          history: alcoholType.history,
          fun_facts: alcoholType.fun_facts,
          myths: alcoholType.myths,
          image: alcoholType.image_url,
          subtypes: subtypes.filter(subtype => subtype.alcohol_type_id === id)
        };
      }

      // If not found in state and Supabase is available, try fetching from database
      if (supabase) {
        const { data, error } = await supabase
          .from('alcohol_types')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Also fetch related subtypes
          const { data: subtypesData } = await supabase
            .from('subtypes')
            .select('*')
            .eq('alcohol_type_id', id);

          return {
            id: data.id,
            name: data.name,
            description: data.description,
            history: data.history,
            fun_facts: data.fun_facts,
            myths: data.myths,
            image: data.image_url,
            subtypes: subtypesData || []
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Error fetching category by ID:', err);
      throw err;
    }
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
    getSubtypesByCategoryId,
    getBrandsBySubtypeId,
    addSpiritToMyBar,
    isInMyBar,
    loadMyBarSpirits,
    addRating,
    getRatingsForBrand,
    getTastingNotesForSpirit,
    getCategoryById
  };

  return (
    <SpiritsContext.Provider value={value}>
      {children}
    </SpiritsContext.Provider>
  );
};