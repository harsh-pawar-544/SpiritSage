// src/contexts/SpiritsContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  type AlcoholType,
  type Subtype,
  type Brand,
  type Rating,
} from '../data/types';

interface FilterOptions {
  alcoholTypes: Array<{ id: string; name: string }>;
  subtypes: Array<{ id: string; name: string }>;
  priceRanges: string[];
  abvRanges: Array<{ min: number; max: number; label: string }>;
}

interface FilterCriteria {
  alcoholTypeIds?: string[];
  subtypeIds?: string[];
  priceRanges?: string[];
  abvRange?: { min: number; max: number };
  searchTerm?: string;
}

interface MyBarSpirit {
  id: string;
  spirit_id: string;
  spirit_type: 'alcohol_type' | 'brand' | 'subtype';
  notes?: string;
  added_at: string;
  spirit_data?: AlcoholType | Subtype | Brand;
}

interface SpiritsContextType {
  alcoholTypes: AlcoholType[];
  loading: boolean;
  error: string | null;
  myBarSpirits: MyBarSpirit[];
  getCategoryById: (id: string) => AlcoholType | undefined;
  getAlcoholTypeById: (id: string) => Promise<AlcoholType | undefined>;
  getSubtypesByCategoryId: (categoryId: string) => Subtype[];
  getSubtypeById: (id: string) => Promise<Subtype | undefined>;
  getBrandsBySubtypeId: (subtypeId: string) => Brand[];
  getBrandById: (brandId: string) => Promise<Brand | undefined>;
  getFilteredSpirits: (filters: FilterCriteria) => Array<AlcoholType | Subtype | Brand>;
  addRating: (brandId: string, rating: number, comment: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => Promise<Rating[]>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<Array<{ term: string; percentage: number }>>;
  getAvailableFilterOptions: () => FilterOptions;
  addSpiritToMyBar: (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes?: string) => Promise<void>;
  removeSpiritFromMyBar: (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype') => Promise<void>;
  updateMyBarNotes: (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes: string) => Promise<void>;
  isInMyBar: (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype') => boolean;
  loadMyBarSpirits: () => Promise<void>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
  const [myBarSpirits, setMyBarSpirits] = useState<MyBarSpirit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of all nested data (for lists and in-memory lookups)
  useEffect(() => {
    const fetchAlcoholData = async () => {
      try {
        const { data: typesData, error: typesError } = await supabase
          .from('alcohol_types')
          .select('*, history, fun_facts, myths, image_url');
        if (typesError) throw typesError;

        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*, alcohol_types(name), history, fun_facts, myths, image_url, abv_min, abv_max, region, flavor_profile, characteristics, production_method');
        if (subtypesError) throw subtypesError;

        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*, subtypes(name, alcohol_types(name)), history, fun_facts, myths, image_url, abv, tasting_notes, price_range');
        if (brandsError) throw brandsError;

        const processedAlcoholTypes = typesData.map(type => ({
          ...type,
          image: type.image_url,
          subtypes: subtypesData
            .filter(sub => sub.alcohol_type_id === type.id)
            .map(sub => ({
              ...sub,
              image: sub.image_url,
              brands: brandsData.filter(brand => brand.subtype_id === sub.id)
                .map(brand => ({ ...brand, image: brand.image_url }))
            }))
        }));

        setAlcoholTypes(processedAlcoholTypes);
      } catch (err: any) {
        console.error('Error fetching spirits data:', err.message);
        setError(err.message || 'Failed to fetch spirits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlcoholData();
  }, []);

  const getCategoryById = useCallback(
    (id: string): AlcoholType | undefined => {
      const found = alcoholTypes.find(cat => cat.id === id);
      return found ? { ...found, image: found.image_url } : undefined;
    },
    [alcoholTypes]
  );

  const getAlcoholTypeById = useCallback(
    async (id: string): Promise<AlcoholType | undefined> => {
      try {
        const { data, error } = await supabase
          .from('alcohol_types')
          .select('*, history, fun_facts, myths, image_url')
          .eq('id', id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching alcohol type by ID ${id}:`, error.message);
          return undefined;
        }
        return data ? { ...data, image: data.image_url } as AlcoholType : undefined;
      } catch (err) {
        console.error(`Exception fetching alcohol type by ID ${id}:`, err);
        return undefined;
      }
    },
    []
  );

  const getSubtypesByCategoryId = useCallback(
    (categoryId: string): Subtype[] => {
      const category = alcoholTypes.find(cat => cat.id === categoryId);
      return category ? category.subtypes.map(sub => ({ ...sub, image: sub.image_url })) : [];
    },
    [alcoholTypes]
  );

  const getSubtypeById = useCallback(
    async (id: string): Promise<Subtype | undefined> => {
      try {
        const { data, error } = await supabase
          .from('subtypes')
          .select('*, alcohol_types(name), history, fun_facts, myths, image_url, abv_min, abv_max, region, flavor_profile, characteristics, production_method')
          .eq('id', id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching subtype by ID ${id}:`, error.message);
          return undefined;
        }
        return data ? { ...data, image: data.image_url } as Subtype : undefined;
      } catch (err) {
        console.error(`Exception fetching subtype by ID ${id}:`, err);
        return undefined;
      }
    },
    []
  );

  const getBrandsBySubtypeId = useCallback(
    (subtypeId: string): Brand[] => {
      let brands: Brand[] = [];
      alcoholTypes.forEach(category => {
        const subtype = category.subtypes.find(sub => sub.id === subtypeId);
        if (subtype) {
          brands = subtype.brands.map(brand => ({ ...brand, image: brand.image_url }));
        }
      });
      return brands;
    },
    [alcoholTypes]
  );

  const getBrandById = useCallback(
    async (brandId: string): Promise<Brand | undefined> => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*, subtypes(name, alcohol_types(name)), history, fun_facts, myths, image_url, abv, tasting_notes, price_range')
          .eq('id', brandId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching brand by ID ${brandId}:`, error.message);
          return undefined;
        }
        return data ? { ...data, image: data.image_url } as Brand : undefined;
      } catch (err) {
        console.error(`Exception fetching brand by ID ${brandId}:`, err);
        return undefined;
      }
    },
    []
  );

  const getFilteredSpirits = useCallback(
    (filters: FilterCriteria): Array<AlcoholType | Subtype | Brand> => {
      const results: Array<AlcoholType | Subtype | Brand> = [];
      
      alcoholTypes.forEach(alcoholType => {
        // Check if alcohol type matches filters
        let alcoholTypeMatches = true;
        
        if (filters.alcoholTypeIds && filters.alcoholTypeIds.length > 0) {
          alcoholTypeMatches = filters.alcoholTypeIds.includes(alcoholType.id);
        }
        
        if (filters.searchTerm && alcoholTypeMatches) {
          alcoholTypeMatches = alcoholType.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                              (alcoholType.description && alcoholType.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        }
        
        if (alcoholTypeMatches) {
          results.push(alcoholType);
        }
        
        // Check subtypes
        alcoholType.subtypes.forEach(subtype => {
          let subtypeMatches = true;
          
          if (filters.subtypeIds && filters.subtypeIds.length > 0) {
            subtypeMatches = filters.subtypeIds.includes(subtype.id);
          }
          
          if (filters.alcoholTypeIds && filters.alcoholTypeIds.length > 0) {
            subtypeMatches = subtypeMatches && filters.alcoholTypeIds.includes(alcoholType.id);
          }
          
          if (filters.searchTerm && subtypeMatches) {
            subtypeMatches = subtype.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            (subtype.description && subtype.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
          }
          
          if (subtypeMatches) {
            results.push(subtype);
          }
          
          // Check brands
          subtype.brands.forEach(brand => {
            let brandMatches = true;
            
            if (filters.alcoholTypeIds && filters.alcoholTypeIds.length > 0) {
              brandMatches = filters.alcoholTypeIds.includes(alcoholType.id);
            }
            
            if (filters.subtypeIds && filters.subtypeIds.length > 0) {
              brandMatches = brandMatches && filters.subtypeIds.includes(subtype.id);
            }
            
            if (filters.priceRanges && filters.priceRanges.length > 0 && brand.price_range) {
              brandMatches = brandMatches && filters.priceRanges.includes(brand.price_range);
            }
            
            if (filters.abvRange && brand.abv) {
              const abv = parseFloat(brand.abv.toString());
              brandMatches = brandMatches && abv >= filters.abvRange.min && abv <= filters.abvRange.max;
            }
            
            if (filters.searchTerm && brandMatches) {
              brandMatches = brand.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            (brand.description && brand.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
            }
            
            if (brandMatches) {
              results.push(brand);
            }
          });
        });
      });
      
      return results;
    },
    [alcoholTypes]
  );

  const getTastingNotesForSpirit = useCallback(
    async (spiritId: string): Promise<Array<{ term: string; percentage: number }>> => {
      console.log(`Fetching tasting notes for spirit: ${spiritId}`);
      return [];
    },
    []
  );

  const getAvailableFilterOptions = useCallback((): FilterOptions => {
    const uniquePriceRanges = new Set<string>();
    const allSubtypes: Array<{ id: string; name: string }> = [];

    alcoholTypes.forEach(type => {
      type.subtypes.forEach(subtype => {
        allSubtypes.push({ id: subtype.id, name: subtype.name });
        
        subtype.brands.forEach(brand => {
          if (brand.price_range) {
            uniquePriceRanges.add(brand.price_range);
          }
        });
      });
    });

    return {
      alcoholTypes: alcoholTypes.map(type => ({ id: type.id, name: type.name })),
      subtypes: allSubtypes,
      priceRanges: Array.from(uniquePriceRanges).sort(),
      abvRanges: [
        { min: 0, max: 20, label: '0-20%' },
        { min: 20, max: 40, label: '20-40%' },
        { min: 40, max: 60, label: '40-60%' },
        { min: 60, max: 100, label: '60%+' }
      ]
    };
  }, [alcoholTypes]);

  const addRating = useCallback(
    async (brandId: string, rating: number, comment: string): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('ratings')
          .insert({
            spirit_id: brandId,
            user_id: user.id,
            rating,
            comment
          });

        if (error) throw error;
      } catch (err: any) {
        console.error('Error adding rating:', err.message);
        throw err;
      }
    },
    []
  );

  const getRatingsForBrand = useCallback(
    async (brandId: string): Promise<Rating[]> => {
      try {
        const { data, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('spirit_id', brandId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (err: any) {
        console.error('Error fetching ratings:', err.message);
        return [];
      }
    },
    []
  );

  const loadMyBarSpirits = useCallback(async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_spirits')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const spiritsWithData = await Promise.all(
        (data || []).map(async (spirit) => {
          let spirit_data;
          
          switch (spirit.spirit_type) {
            case 'alcohol_type':
              spirit_data = await getAlcoholTypeById(spirit.spirit_id);
              break;
            case 'subtype':
              spirit_data = await getSubtypeById(spirit.spirit_id);
              break;
            case 'brand':
              spirit_data = await getBrandById(spirit.spirit_id);
              break;
          }
          
          return {
            ...spirit,
            spirit_data
          };
        })
      );

      setMyBarSpirits(spiritsWithData);
    } catch (err: any) {
      console.error('Error loading My Bar spirits:', err.message);
    }
  }, [getAlcoholTypeById, getSubtypeById, getBrandById]);

  const addSpiritToMyBar = useCallback(
    async (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes?: string): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('user_spirits')
          .insert({
            user_id: user.id,
            spirit_id: spiritId,
            spirit_type: spiritType,
            notes
          });

        if (error) throw error;
        await loadMyBarSpirits();
      } catch (err: any) {
        console.error('Error adding spirit to My Bar:', err.message);
        throw err;
      }
    },
    [loadMyBarSpirits]
  );

  const removeSpiritFromMyBar = useCallback(
    async (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype'): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('user_spirits')
          .delete()
          .eq('user_id', user.id)
          .eq('spirit_id', spiritId)
          .eq('spirit_type', spiritType);

        if (error) throw error;
        await loadMyBarSpirits();
      } catch (err: any) {
        console.error('Error removing spirit from My Bar:', err.message);
        throw err;
      }
    },
    [loadMyBarSpirits]
  );

  const updateMyBarNotes = useCallback(
    async (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes: string): Promise<void> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('user_spirits')
          .update({ notes })
          .eq('user_id', user.id)
          .eq('spirit_id', spiritId)
          .eq('spirit_type', spiritType);

        if (error) throw error;
        await loadMyBarSpirits();
      } catch (err: any) {
        console.error('Error updating My Bar notes:', err.message);
        throw err;
      }
    },
    [loadMyBarSpirits]
  );

  const isInMyBar = useCallback(
    (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype'): boolean => {
      return myBarSpirits.some(
        spirit => spirit.spirit_id === spiritId && spirit.spirit_type === spiritType
      );
    },
    [myBarSpirits]
  );

  // Load My Bar spirits on mount and when user changes
  useEffect(() => {
    loadMyBarSpirits();
  }, [loadMyBarSpirits]);

  const contextValue = {
    alcoholTypes,
    loading,
    error,
    myBarSpirits,
    getCategoryById,
    getAlcoholTypeById,
    getSubtypesByCategoryId,
    getSubtypeById,
    getBrandsBySubtypeId,
    getBrandById,
    getFilteredSpirits,
    addRating,
    getRatingsForBrand,
    getTastingNotesForSpirit,
    getAvailableFilterOptions,
    addSpiritToMyBar,
    removeSpiritFromMyBar,
    updateMyBarNotes,
    isInMyBar,
    loadMyBarSpirits,
  };

  return (
    <SpiritsContext.Provider value={contextValue}>
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