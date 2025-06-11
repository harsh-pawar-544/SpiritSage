import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { useAuth } from './AuthContext'; // Import useAuth hook
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

interface MyBarSpirit {
  id: string;
  user_id: string;
  spirit_id: string;
  spirit_type: 'alcohol_type' | 'subtype' | 'brand';
  notes?: string;
  added_at: string;
  spirit_data?: any;
}

interface SpiritsContextType {
  spirits: Spirit[];
  alcoholTypes: any[];
  subtypes: any[];
  brands: any[];
  myBarSpirits: MyBarSpirit[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  refreshData: () => Promise<void>;
  getAvailableFilterOptions: () => FilterOptions;
  getFilteredSpirits: (filters: any) => Spirit[];
  addSpiritToMyBar: (spiritId: string, spiritType: string, notes?: string) => Promise<void>;
  isInMyBar: (spiritId: string, spiritType: string) => boolean;
  removeSpiritFromMyBar: (userSpiritRecordId: string) => Promise<void>;
  updateMyBarNotes: (userSpiritRecordId: string, notes: string) => Promise<void>;
  loadMyBarSpirits: () => Promise<void>;
  addRating: (spiritId: string, rating: number, comment?: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => any[];
  getTastingNotesForSpirit: (spiritId: string) => Array<{term: string; percentage?: number}>;
  getCategoryById: (id: string) => Promise<any>;
  getBrandById: (id: string) => Promise<any>;
  getSubtypeById: (id: string) => Promise<any>;
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

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spirits, setSpirits] = useState<Spirit[]>([]);
  const [alcoholTypes, setAlcoholTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [myBarSpirits, setMyBarSpirits] = useState<MyBarSpirit[]>([]);

  // Get user from AuthContext
  const { user } = useAuth();

  const fetchAlcoholTypes = async () => {
    if (!supabase) {
      console.log('Using mock alcohol types data');
      return [
        { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash', image_url: 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg' },
        { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage', image_url: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg' },
        { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane', image_url: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg' },
        { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries', image_url: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg' },
        { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant', image_url: 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg' }
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

  const loadMyBarSpirits = useCallback(async () => {
    if (!supabase || !user) {
      console.log('Cannot load My Bar spirits - no Supabase or user not authenticated');
      setMyBarSpirits([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_spirits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading My Bar spirits:', error);
        return;
      }

      // Enrich with spirit data
      const enrichedSpirits = (data || []).map((spirit) => {
        let spiritData = null;
        switch (spirit.spirit_type) {
          case 'alcohol_type':
            spiritData = alcoholTypes.find(at => at.id === spirit.spirit_id);
            break;
          case 'subtype':
            spiritData = subtypes.find(st => st.id === spirit.spirit_id);
            break;
          case 'brand':
            spiritData = brands.find(b => b.id === spirit.spirit_id);
            break;
        }
        return { ...spirit, spirit_data: spiritData };
      });

      setMyBarSpirits(enrichedSpirits);
    } catch (err) {
      console.error('Error loading My Bar spirits:', err);
    }
  }, [user, alcoholTypes, subtypes, brands]);

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
          { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash', image_url: 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg' },
          { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage', image_url: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg' },
          { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane', image_url: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg' },
          { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries', image_url: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg' },
          { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant', image_url: 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg' }
        ]);
        setSubtypes([]);
        setBrands([]);
        setLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [alcoholTypesData, subtypesData, brandsData] = await Promise.all([
        fetchAlcoholTypes(),
        fetchSubtypes(),
        fetchBrands()
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
        { id: '1', name: 'Whiskey', description: 'Distilled alcoholic beverage made from fermented grain mash', image_url: 'https://images.pexels.com/photos/5947028/pexels-photo-5947028.jpeg' },
        { id: '2', name: 'Vodka', description: 'Clear distilled alcoholic beverage', image_url: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg' },
        { id: '3', name: 'Rum', description: 'Distilled alcoholic drink made from sugarcane', image_url: 'https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg' },
        { id: '4', name: 'Gin', description: 'Distilled alcoholic drink flavored with juniper berries', image_url: 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg' },
        { id: '5', name: 'Tequila', description: 'Distilled beverage made from blue agave plant', image_url: 'https://images.pexels.com/photos/8105118/pexels-photo-8105118.jpeg' }
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
    if (!supabase || !user) {
      throw new Error('Please sign in to add spirits to your bar');
    }

    try {
      // Check if spirit already exists in user's bar
      const { data: existingSpirit } = await supabase
        .from('user_spirits')
        .select('id')
        .eq('user_id', user.id)
        .eq('spirit_id', spiritId)
        .eq('spirit_type', spiritType)
        .single();

      if (existingSpirit) {
        throw new Error('Spirit already in your bar');
      }

      const { error } = await supabase
        .from('user_spirits')
        .insert({
          user_id: user.id,
          spirit_id: spiritId,
          spirit_type: spiritType,
          notes: notes || null
        });

      if (error) throw error;

      // Reload My Bar spirits
      await loadMyBarSpirits();
    } catch (err: any) {
      console.error('Error adding spirit to My Bar:', err);
      throw err;
    }
  };

  const isInMyBar = (spiritId: string, spiritType: string): boolean => {
    return myBarSpirits.some(spirit => 
      spirit.spirit_id === spiritId && spirit.spirit_type === spiritType
    );
  };

  const removeSpiritFromMyBar = async (userSpiritRecordId: string): Promise<void> => {
    if (!supabase || !user) {
      throw new Error('Please sign in to manage your bar');
    }

    try {
      const { error } = await supabase
        .from('user_spirits')
        .delete()
        .eq('id', userSpiritRecordId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Reload My Bar spirits
      await loadMyBarSpirits();
    } catch (err: any) {
      console.error('Error removing spirit from My Bar:', err);
      throw err;
    }
  };

  const updateMyBarNotes = async (userSpiritRecordId: string, notes: string): Promise<void> => {
    if (!supabase || !user) {
      throw new Error('Please sign in to update notes');
    }

    try {
      const { error } = await supabase
        .from('user_spirits')
        .update({ notes })
        .eq('id', userSpiritRecordId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Reload My Bar spirits
      await loadMyBarSpirits();
    } catch (err: any) {
      console.error('Error updating My Bar notes:', err);
      throw err;
    }
  };

  const addRating = async (spiritId: string, rating: number, comment?: string): Promise<void> => {
    if (!supabase || !user) {
      throw new Error('Please sign in to add ratings');
    }

    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          spirit_id: spiritId,
          user_id: user.id,
          rating,
          comment: comment || null
        });

      if (error) throw error;
    } catch (err: any) {
      console.error('Error adding rating:', err);
      throw err;
    }
  };

  const getRatingsForBrand = (brandId: string): any[] => {
    // Return empty array for now - would fetch from database when available
    return [];
  };

  const getTastingNotesForSpirit = (spiritId: string): Array<{term: string; percentage?: number}> => {
    const spirit = spirits.find(s => s.id === spiritId);
    const tastingNotes = spirit?.tasting_notes || [];
    
    // Transform array of strings to array of objects with term and percentage
    return tastingNotes.map(note => ({
      term: note,
      percentage: undefined // No percentage data available in current schema
    }));
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

  const getBrandById = async (id: string): Promise<any> => {
    try {
      // First check if we have the brand in our current state
      const brand = brands.find(b => b.id === id);
      if (brand) {
        return {
          id: brand.id,
          name: brand.name,
          description: brand.description,
          abv: brand.abv,
          tasting_notes: brand.tasting_notes,
          price_range: brand.price_range,
          history: brand.history,
          fun_facts: brand.fun_facts,
          myths: brand.myths,
          image_url: brand.image_url,
          subtype_name: brand.subtypes?.name,
          alcohol_type_name: brand.subtypes?.alcohol_types?.name,
          subtype_id: brand.subtype_id,
          alcohol_type_id: brand.subtypes?.alcohol_types?.id
        };
      }

      // If not found in state and Supabase is available, try fetching from database
      if (supabase) {
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
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          return {
            id: data.id,
            name: data.name,
            description: data.description,
            abv: data.abv,
            tasting_notes: data.tasting_notes,
            price_range: data.price_range,
            history: data.history,
            fun_facts: data.fun_facts,
            myths: data.myths,
            image_url: data.image_url,
            subtype_name: data.subtypes?.name,
            alcohol_type_name: data.subtypes?.alcohol_types?.name,
            subtype_id: data.subtype_id,
            alcohol_type_id: data.subtypes?.alcohol_types?.id
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Error fetching brand by ID:', err);
      throw err;
    }
  };

  const getSubtypeById = async (id: string): Promise<any> => {
    try {
      // First check if we have the subtype in our current state
      const subtype = subtypes.find(s => s.id === id);
      if (subtype) {
        return {
          id: subtype.id,
          name: subtype.name,
          region: subtype.region,
          description: subtype.description,
          abv_min: subtype.abv_min,
          abv_max: subtype.abv_max,
          flavor_profile: subtype.flavor_profile,
          characteristics: subtype.characteristics,
          production_method: subtype.production_method,
          history: subtype.history,
          fun_facts: subtype.fun_facts,
          myths: subtype.myths,
          image_url: subtype.image_url,
          alcohol_type_name: subtype.alcohol_types?.name,
          alcohol_type_id: subtype.alcohol_type_id
        };
      }

      // If not found in state and Supabase is available, try fetching from database
      if (supabase) {
        const { data, error } = await supabase
          .from('subtypes')
          .select(`
            *,
            alcohol_types (
              id,
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          return {
            id: data.id,
            name: data.name,
            region: data.region,
            description: data.description,
            abv_min: data.abv_min,
            abv_max: data.abv_max,
            flavor_profile: data.flavor_profile,
            characteristics: data.characteristics,
            production_method: data.production_method,
            history: data.history,
            fun_facts: data.fun_facts,
            myths: data.myths,
            image_url: data.image_url,
            alcohol_type_name: data.alcohol_types?.name,
            alcohol_type_id: data.alcohol_type_id
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Error fetching subtype by ID:', err);
      throw err;
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAllSpiritsData();
  }, []);

  // Load My Bar spirits when user changes or data is loaded
  useEffect(() => {
    if (user && alcoholTypes.length > 0) {
      loadMyBarSpirits();
    } else if (!user) {
      setMyBarSpirits([]);
    }
  }, [user, alcoholTypes, subtypes, brands, loadMyBarSpirits]);

  const value: SpiritsContextType = {
    spirits,
    alcoholTypes,
    subtypes,
    brands,
    myBarSpirits,
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
    removeSpiritFromMyBar,
    updateMyBarNotes,
    loadMyBarSpirits,
    addRating,
    getRatingsForBrand,
    getTastingNotesForSpirit,
    getCategoryById,
    getBrandById,
    getSubtypeById
  };

  return (
    <SpiritsContext.Provider value={value}>
      {children}
    </SpiritsContext.Provider>
  );
};