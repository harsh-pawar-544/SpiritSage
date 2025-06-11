import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
  type AlcoholType,
  type Subtype,
  type Brand,
  type Rating,
} from '../data/types'; // Ensure your types include alcohol_type_id, alcohol_type_name, subtype_id, subtype_name on Brand/Subtype where applicable

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
  brands: Brand[]; // Added for ExplorePage and general use
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

  // Memoized 'brands' array for easier access, used by ExplorePage
  const brands = useMemo(() => {
    const allBrands: Brand[] = [];
    alcoholTypes.forEach(alcoholType => {
      alcoholType.subtypes?.forEach(subtype => {
        subtype.brands?.forEach(brand => {
          allBrands.push({
            ...brand,
            alcohol_type_id: alcoholType.id,
            alcohol_type_name: alcoholType.name,
            subtype_id: subtype.id,
            subtype_name: subtype.name,
          });
        });
      });
    });
    return allBrands;
  }, [alcoholTypes]);


  // Helper function to find spirit data in the already loaded alcoholTypes state
  const findSpiritDataInState = useCallback((spiritId: string, spiritType: MyBarSpirit['spirit_type']): AlcoholType | Subtype | Brand | undefined => {
    switch (spiritType) {
      case 'alcohol_type':
        return alcoholTypes.find(at => at.id === spiritId);
      case 'subtype':
        for (const at of alcoholTypes) {
          const subtype = at.subtypes?.find(s => s.id === spiritId);
          if (subtype) return subtype;
        }
        return undefined;
      case 'brand':
        for (const at of alcoholTypes) {
          for (const s of (at.subtypes || [])) {
            const brand = s.brands?.find(b => b.id === spiritId);
            if (brand) return brand;
          }
        }
        return undefined;
      default:
        return undefined;
    }
  }, [alcoholTypes]);

  const loadMyBarSpirits = useCallback(async (): Promise<void> => {
    console.log('loadMyBarSpirits called');
    try {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) {
        setMyBarSpirits([]);
        return;
      }

      console.log('Loading My Bar spirits for user:', user.id);
      const { data, error: fetchError } = await supabase
        .from('user_spirits')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error loading My Bar spirits:', fetchError);
        throw new Error(`Failed to load My Bar spirits: ${fetchError.message}`);
      }

      // OPTIMIZATION: Instead of new Supabase calls, look up data from `alcoholTypes` state
      const spiritsWithData = (data || []).map((spirit) => {
        const spirit_data = findSpiritDataInState(spirit.spirit_id, spirit.spirit_type);
        return { ...spirit, spirit_data };
      });

      setMyBarSpirits(spiritsWithData as MyBarSpirit[]);
    } catch (err: any) {
      console.error('Error loading My Bar spirits:', err);
      setMyBarSpirits([]);
    }
  }, [findSpiritDataInState]);

  // Initial fetch of all nested data (for lists and in-memory lookups)
  useEffect(() => {
    const fetchAlcoholData = async () => {
      console.log('fetchAlcoholData useEffect called');
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching alcohol types...');
        const { data: typesData, error: typesError } = await supabase
          .from('alcohol_types')
          .select('*, subtypes(*, brands(*))'); // Fetch nested data in one go

        if (typesError) {
          console.error('Error fetching alcohol types:', typesError);
          throw new Error(`Failed to fetch alcohol types: ${typesError.message}`);
        }

        const processedAlcoholTypes = (typesData || []).map(type => ({
          ...type,
          image: type.image_url,
          subtypes: (type.subtypes || []).map((sub: any) => ({ // Ensure 'sub' is typed correctly if needed
            ...sub,
            image: sub.image_url,
            brands: (sub.brands || []).map((brand: any) => ({ // Ensure 'brand' is typed correctly if needed
              ...brand,
              image: brand.image_url,
              // Add direct parent IDs and names here for consistency
              alcohol_type_id: type.id,
              alcohol_type_name: type.name,
              subtype_id: sub.id,
              subtype_name: sub.name,
            }))
          }))
        }));

        setAlcoholTypes(processedAlcoholTypes);
        console.log('Data loaded successfully and setAlcoholTypes called.');

        await loadMyBarSpirits();
        console.log('loadMyBarSpirits completed after initial data fetch.');

      } catch (err: any) {
        console.error('Error in fetchAlcoholData:', err);
        setError(err.message || 'Failed to fetch spirits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlcoholData();
  }, []);

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
        const { data, error: fetchError } = await supabase
          .from('alcohol_types')
          .select('*') // Just fetch the type itself
          .eq('id', id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            console.log(`Alcohol type with ID ${id} not found`);
            return undefined;
          }
          console.error(`Error fetching alcohol type by ID ${id}:`, fetchError);
          throw new Error(`Failed to fetch alcohol type: ${fetchError.message}`);
        }

        return data ? { ...data, image: data.image_url } as AlcoholType : undefined;
      } catch (err: any) {
        console.error(`Exception fetching alcohol type by ID ${id}:`, err);
        throw err;
      }
    },
    []
  );

  const getSubtypesByCategoryId = useCallback(
    (categoryId: string): Subtype[] => {
      const category = alcoholTypes.find(cat => cat.id === categoryId);
      return category ? (category.subtypes || []).map(sub => ({ ...sub, image: sub.image_url })) : [];
    },
    [alcoholTypes]
  );

  const getSubtypeById = useCallback(
    async (id: string): Promise<Subtype | undefined> => {
      try {
        console.log(`Fetching subtype by ID: ${id}`);
        const { data, error: fetchError } = await supabase
          .from('subtypes')
          // Fetch alcohol_type details in the same query
          .select('*, alcohol_types(id, name)')
          .eq('id', id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            console.log(`Subtype with ID ${id} not found`);
            return undefined;
          }
          console.error(`Error fetching subtype by ID ${id}:`, fetchError);
          throw new Error(`Failed to fetch subtype: ${fetchError.message}`);
        }

        if (!data) return undefined;

        const subtypeWithParent: Subtype = {
          ...data,
          image: data.image_url,
          // Map the nested alcohol_types data to direct properties on the Subtype object
          alcohol_type_id: data.alcohol_types?.id || null,
          alcohol_type_name: data.alcohol_types?.name || null,
        };

        return subtypeWithParent;
      } catch (err: any) {
        console.error(`Exception fetching subtype by ID ${id}:`, err);
        throw err;
      }
    },
    []
  );

  const getBrandsBySubtypeId = useCallback(
    (subtypeId: string): Brand[] => {
      let brands: Brand[] = [];
      alcoholTypes.forEach(category => {
        const subtype = (category.subtypes || []).find(sub => sub.id === subtypeId);
        if (subtype) {
          brands = (subtype.brands || []).map(brand => ({ ...brand, image: brand.image_url }));
        }
      });
      return brands;
    },
    [alcoholTypes]
  );

  const getBrandById = useCallback(async (brandId: string): Promise<Brand | undefined> => {
    try {
      console.log(`Fetching brand by ID: ${brandId}`);
      const { data, error: fetchError } = await supabase
        .from('brands')
        // CRITICAL CHANGE: Use foreign table relationships to get parent IDs and names
        .select('*, subtypes(id, name, alcohol_type_id, alcohol_types(id, name))')
        .eq('id', brandId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          console.log(`Brand with ID ${brandId} not found`);
          return undefined;
        }
        console.error(`Error fetching brand by ID ${brandId}:`, fetchError);
        throw new Error(`Failed to fetch brand: ${fetchError.message}`);
      }

      if (!data) return undefined;

      const brandData: Brand = {
        ...data,
        image: data.image_url,
        // Map the nested data to direct properties as SpiritDetailModal expects
        alcohol_type_id: data.subtypes?.alcohol_types?.id || null,
        alcohol_type_name: data.subtypes?.alcohol_types?.name || null,
        subtype_id: data.subtypes?.id || null,
        subtype_name: data.subtypes?.name || null,
      };

      return brandData;

    } catch (err: any) {
      console.error(`Exception fetching brand by ID ${brandId}:`, err);
      throw err;
    }
  },
  []);

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
          results.push({ ...alcoholType, image: alcoholType.image_url }); // Add image to result
        }

        (alcoholType.subtypes || []).forEach(subtype => {
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
            results.push({ ...subtype, image: subtype.image_url }); // Add image to result
          }

          (subtype.brands || []).forEach(brand => {
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
              results.push({ ...brand, image: brand.image_url }); // Add image to result
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
      // Implement actual fetching logic here if needed
      return [];
    },
    []
  );

  const getAvailableFilterOptions = useCallback((): FilterOptions => {
    const uniquePriceRanges = new Set<string>();
    const allSubtypes: Array<{ id: string; name: string }> = [];

    alcoholTypes.forEach(type => {
      allSubtypes.push({ id: type.id, name: type.name }); // Add alcohol types to subtypes for filtering consistency
      (type.subtypes || []).forEach(subtype => {
        allSubtypes.push({ id: subtype.id, name: subtype.name });

        (subtype.brands || []).forEach(brand => {
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
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error: insertError } = await supabase
          .from('ratings')
          .insert({
            spirit_id: brandId,
            user_id: user.id,
            rating,
            comment
          });

        if (insertError) {
          console.error('Error adding rating:', insertError);
          throw new Error(`Failed to add rating: ${insertError.message}`);
        }
      } catch (err: any) {
        console.error('Error adding rating:', err);
        throw err;
      }
    },
    []
  );

  const getRatingsForBrand = useCallback(
    async (brandId: string): Promise<Rating[]> => {
      try {
        console.log(`Fetching ratings for brand: ${brandId}`);
        const { data, error: fetchError } = await supabase
          .from('ratings')
          .select('*')
          .eq('spirit_id', brandId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching ratings:', fetchError);
          throw new Error(`Failed to fetch ratings: ${fetchError.message}`);
        }

        return data || [];
      } catch (err: any) {
        console.error('Error fetching ratings:', err);
        return [];
      }
    },
    []
  );

  const addSpiritToMyBar = useCallback(
    async (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes?: string): Promise<void> => {
      try {
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error: insertError } = await supabase
          .from('user_spirits')
          .insert({
            user_id: user.id,
            spirit_id: spiritId,
            spirit_type: spiritType,
            notes
          });

        if (insertError) {
          console.error('Error adding spirit to My Bar:', insertError);
          throw new Error(`Failed to add spirit to My Bar: ${insertError.message}`);
        }

        await loadMyBarSpirits();
      } catch (err: any) {
        console.error('Error adding spirit to My Bar:', err);
        throw err;
      }
    },
    [loadMyBarSpirits]
  );

  const removeSpiritFromMyBar = useCallback(async (userSpiritRecordId: string) => {
    try {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // The correct delete query: targets the specific user_spirits record by its 'id' (primary key)
      // and also includes 'user_id' for added security and RLS validation.
      const { error } = await supabase
        .from('user_spirits')
        .delete()
        .eq('id', userSpiritRecordId) // <-- CRITICAL: Uses the primary key 'id' of the user_spirits record
        .eq('user_id', user.id);     // <-- Ensures the logged-in user owns this record

      if (error) {
        console.error('Supabase delete error details:', error); // Log the full Supabase error object
        throw new Error(`Failed to remove spirit: ${error.message}`); // Throw a more informative error
      }

      console.log('Spirit successfully removed from My Bar!'); // Log success
      await loadMyBarSpirits(); // Reload the bar to reflect the change
    } catch (error: any) { // Catch as any to ensure .message is accessible
      console.error('Error removing spirit from My Bar catch block:', error.message || error);
      throw error; // Re-throw to propagate the error up to the UI
    }
  }, [loadMyBarSpirits]); // Dependencies for useCallback
      } catch (err: any) {
        console.error('Error removing spirit from My Bar:', err);
        throw err;
      }
    },
    [loadMyBarSpirits]
  );

  const updateMyBarNotes = useCallback(
    async (spiritId: string, spiritType: 'alcohol_type' | 'brand' | 'subtype', notes: string): Promise<void> => {
      try {
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error: updateError } = await supabase
          .from('user_spirits')
          .update({ notes })
          .eq('user_id', user.id)
          .eq('spirit_id', spiritId)
          .eq('spirit_type', spiritType);

        if (updateError) {
          console.error('Error updating My Bar notes:', updateError);
          throw new Error(`Failed to update My Bar notes: ${updateError.message}`);
        }

        await loadMyBarSpirits();
      } catch (err: any) {
        console.error('Error updating My Bar notes:', err);
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

  const contextValue = {
    alcoholTypes,
    brands, // Now included in context
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