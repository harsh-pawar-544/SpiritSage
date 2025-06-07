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

  // loadMyBarSpirits needs to be defined here first as it's a dependency for other callbacks
  // We'll define it without a dependency array first, and then include it in the final context value.
  // This is a common pattern to avoid circular dependencies with useCallback.
  const loadMyBarSpirits = useCallback(async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMyBarSpirits([]); // Clear spirits if no user
        return;
      }

      console.log('Loading My Bar spirits for user:', user.id);
      const { data, error } = await supabase
        .from('user_spirits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading My Bar spirits:', error);
        throw new Error(`Failed to load My Bar spirits: ${error.message}`);
      }

      // These functions are used here, so they need to be available and stable.
      // We'll include them in loadMyBarSpirits's dependency array once defined
      // to ensure it re-runs if those methods change.
      const spiritsWithData = await Promise.all(
        (data || []).map(async (spirit) => {
          let spirit_data;
          try {
            switch (spirit.spirit_type) {
              case 'alcohol_type':
                spirit_data = await supabase
                  .from('alcohol_types')
                  .select('*')
                  .eq('id', spirit.spirit_id)
                  .single();
                spirit_data = spirit_data.data ? { ...spirit_data.data, image: spirit_data.data.image_url } : undefined;
                break;
              case 'subtype':
                spirit_data = await supabase
                  .from('subtypes')
                  .select('*')
                  .eq('id', spirit.spirit_id)
                  .single();
                spirit_data = spirit_data.data ? { ...spirit_data.data, image: spirit_data.data.image_url } : undefined;
                break;
              case 'brand':
                spirit_data = await supabase
                  .from('brands')
                  .select('*')
                  .eq('id', spirit.spirit_id)
                  .single();
                spirit_data = spirit_data.data ? { ...spirit_data.data, image: spirit_data.data.image_url } : undefined;
                break;
            }
          } catch (error) {
            console.error(`Error fetching spirit data for ${spirit.spirit_id}:`, error);
            spirit_data = null;
          }
          return { ...spirit, spirit_data };
        })
      );
      setMyBarSpirits(spiritsWithData as MyBarSpirit[]);
    } catch (err: any) {
      console.error('Error loading My Bar spirits:', err);
      // It's good practice to set myBarSpirits to an empty array on error
      setMyBarSpirits([]);
    }
  }, []); // Initial dependency array for loadMyBarSpirits is empty as it doesn't immediately use other context functions itself.


  // Initial fetch of all nested data (for lists and in-memory lookups)
  useEffect(() => {
    const fetchAlcoholData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching alcohol types...');
        const { data: typesData, error: typesError } = await supabase
          .from('alcohol_types')
          .select('*');

        if (typesError) {
          console.error('Error fetching alcohol types:', typesError);
          throw new Error(`Failed to fetch alcohol types: ${typesError.message}`);
        }

        console.log('Fetching subtypes...');
        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*');

        if (subtypesError) {
          console.error('Error fetching subtypes:', subtypesError);
          throw new Error(`Failed to fetch subtypes: ${subtypesError.message}`);
        }

        console.log('Fetching brands...');
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*');

        if (brandsError) {
          console.error('Error fetching brands:', brandsError);
          throw new Error(`Failed to fetch brands: ${brandsError.message}`);
        }

        console.log('Processing data...');
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
        console.log('Data loaded successfully');
      } catch (err: any) {
        console.error('Error in fetchAlcoholData:', err);
        setError(err.message || 'Failed to fetch spirits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlcoholData();
  }, []); // Empty dependency array means this runs once on mount.

  // --- Memoized Functions ---

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
        console.log(`Fetching alcohol type by ID: ${id}`);
        const { data, error } = await supabase
          .from('alcohol_types')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log(`Alcohol type with ID ${id} not found`);
            return undefined;
          }
          console.error(`Error fetching alcohol type by ID ${id}:`, error);
          throw new Error(`Failed to fetch alcohol type: ${error.message}`);
        }

        return data ? { ...data, image: data.image_url } as AlcoholType : undefined;
      } catch (err: any) {
        console.error(`Exception fetching alcohol type by ID ${id}:`, err);
        throw err;
      }
    },
    [] // No external dependencies that would change per render
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
        console.log(`Fetching subtype by ID: ${id}`);
        const { data, error } = await supabase
          .from('subtypes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log(`Subtype with ID ${id} not found`);
            return undefined;
          }
          console.error(`Error fetching subtype by ID ${id}:`, error);
          throw new Error(`Failed to fetch subtype: ${error.message}`);
        }

        let alcoholTypeName = null;
        if (data?.alcohol_type_id) {
          try {
            const { data: alcoholTypeData } = await supabase
              .from('alcohol_types')
              .select('name')
              .eq('id', data.alcohol_type_id)
              .single();
            alcoholTypeName = alcoholTypeData?.name;
          } catch (alcoholTypeError) {
            console.warn('Could not fetch alcohol type name:', alcoholTypeError);
          }
        }

        return data ? {
          ...data,
          image: data.image_url,
          alcohol_types: alcoholTypeName ? { name: alcoholTypeName } : null
        } as Subtype : undefined;
      } catch (err: any) {
        console.error(`Exception fetching subtype by ID ${id}:`, err);
        throw err;
      }
    },
    [] // No external dependencies that would change per render
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

  const getBrandById = useCallback(async (brandId: string) => {
    try {
      console.log(`Fetching brand by ID: ${brandId}`);
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`Brand with ID ${brandId} not found`);
          return undefined;
        }
        console.error(`Error fetching brand by ID ${brandId}:`, error);
        throw new Error(`Failed to fetch brand: ${error.message}`);
      }

      let subtypeName = null;
      let alcoholTypeName = null;

      if (data?.subtype_id) {
        try {
          const { data: subtypeData } = await supabase
            .from('subtypes')
            .select('name, alcohol_type_id')
            .eq('id', data.subtype_id)
            .single();

          subtypeName = subtypeData?.name;

          if (subtypeData?.alcohol_type_id) {
            const { data: alcoholTypeData } = await supabase
              .from('alcohol_types')
              .select('name')
              .eq('id', subtypeData.alcohol_type_id)
              .single();
            alcoholTypeName = alcoholTypeData?.name;
          }
        } catch (relationError) {
          console.warn('Could not fetch related data for brand:', relationError);
        }
      }

      return data ? {
        ...data,
        image: data.image_url,
        subtypes: subtypeName ? {
          name: subtypeName,
          alcohol_types: alcoholTypeName ? { name: alcoholTypeName } : null
        } : null
      } as Brand : undefined;
    } catch (err: any) {
      console.error(`Exception fetching brand by ID ${brandId}:`, err);
      throw err;
    }
  },
  [] // No external dependencies that would change per render
  );

  const getFilteredSpirits = useCallback(
    (filters: FilterCriteria): Array<AlcoholType | Subtype | Brand> => {
      const results: Array<AlcoholType | Subtype | Brand> = [];

      alcoholTypes.forEach(alcoholType => {
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
    [alcoholTypes] // Depends on 'alcoholTypes' state for filtering
  );

  const getTastingNotesForSpirit = useCallback(
    async (spiritId: string): Promise<Array<{ term: string; percentage: number }>> => {
      console.log(`Fetching tasting notes for spirit: ${spiritId}`);
      // As this is currently a placeholder, no dynamic dependencies.
      // If you implement actual fetching here, add 'supabase' to dependencies.
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
  }, [alcoholTypes]); // Depends on 'alcoholTypes' state

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

        if (error) {
          console.error('Error adding rating:', error);
          throw new Error(`Failed to add rating: ${error.message}`);
        }
      } catch (err: any) {
        console.error('Error adding rating:', err);
        throw err;
      }
    },
    [] // No external dependencies that would change per render
  );

  const getRatingsForBrand = useCallback(
    async (brandId: string): Promise<Rating[]> => {
      try {
        console.log(`Fetching ratings for brand: ${brandId}`);
        const { data, error } = await supabase
          .from('ratings')
          .select('*')
          .eq('spirit_id', brandId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching ratings:', error);
          throw new Error(`Failed to fetch ratings: ${error.message}`);
        }

        return data || [];
      } catch (err: any) {
        console.error('Error fetching ratings:', err);
        return [];
      }
    },
    [] // No external dependencies that would change per render
  );

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

        if (error) {
          console.error('Error adding spirit to My Bar:', error);
          throw new Error(`Failed to add spirit to My Bar: ${error.message}`);
        }

        await loadMyBarSpirits(); // Calling the memoized function
      } catch (err: any) {
        console.error('Error adding spirit to My Bar:', err);
        throw err;
      }
    },
    [loadMyBarSpirits] // Depends on loadMyBarSpirits
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

        if (error) {
          console.error('Error removing spirit from My Bar:', error);
          throw new Error(`Failed to remove spirit from My Bar: ${error.message}`);
        }

        await loadMyBarSpirits(); // Calling the memoized function
      } catch (err: any) {
        console.error('Error removing spirit from My Bar:', err);
        throw err;
      }
    },
    [loadMyBarSpirits] // Depends on loadMyBarSpirits
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

        if (error) {
          console.error('Error updating My Bar notes:', error);
          throw new Error(`Failed to update My Bar notes: ${error.message}`);
        }

        await loadMyBarSpirits(); // Calling the memoized function
      } catch (err: any) {
        console.error('Error updating My Bar notes:', err);
        throw err;
      }
    },
    [loadMyBarSpirits] // Depends on loadMyBarSpirits
  );

  const isInMyBar = useCallback(
    (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype'): boolean => {
      return myBarSpirits.some(
        spirit => spirit.spirit_id === spiritId && spirit.spirit_type === spiritType
      );
    },
    [myBarSpirits] // Depends on myBarSpirits state
  );

  // Load My Bar spirits on mount and when user changes
  useEffect(() => {
    loadMyBarSpirits();
  }, [loadMyBarSpirits]); // loadMyBarSpirits is now memoized

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