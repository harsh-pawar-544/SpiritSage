import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  type AlcoholType,
  type Subtype,
  type Brand,
  type Rating,
} from '../data/types';

interface FilterOptions {
  regions: string[];
  flavorProfiles: string[];
  priceRanges: string[];
  abvRanges: string[];
  ageStatements: string[];
  distilleries: string[];
}

interface MyBarSpirit {
  id: string;
  user_id: string;
  spirit_id: string;
  spirit_type: 'alcohol_type' | 'subtype' | 'brand';
  added_at: string;
  notes?: string;
  spirit_data?: any; // The actual spirit data
}

interface SpiritsContextType {
  alcoholTypes: AlcoholType[];
  allSubtypes: Subtype[];
  allBrands: Brand[];
  myBarSpirits: MyBarSpirit[];
  loading: boolean;
  error: string | null;
  
  // Existing methods
  getCategoryById: (id: string) => AlcoholType | undefined;
  getAlcoholTypeById: (id: string) => Promise<AlcoholType | undefined>;
  getSubtypesByCategoryId: (categoryId: string) => Subtype[];
  getSubtypeById: (id: string) => Promise<Subtype | undefined>;
  getBrandsBySubtypeId: (subtypeId: string) => Brand[];
  getBrandById: (brandId: string) => Promise<Brand | undefined>;
  
  // New filtering methods
  getFilteredSpirits: (filters: Partial<FilterOptions>, searchQuery?: string) => {
    alcoholTypes: AlcoholType[];
    subtypes: Subtype[];
    brands: Brand[];
  };
  getAvailableFilterOptions: () => FilterOptions;
  
  // My Bar functionality
  addSpiritToMyBar: (spiritId: string, spiritType: 'alcohol_type' | 'subtype' | 'brand', notes?: string) => Promise<void>;
  removeSpiritFromMyBar: (spiritId: string) => Promise<void>;
  updateMyBarNotes: (spiritId: string, notes: string) => Promise<void>;
  isInMyBar: (spiritId: string) => boolean;
  loadMyBarSpirits: () => Promise<void>;
  
  // Rating functionality
  addRating: (brandId: string, rating: number, comment: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => Promise<Rating[]>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<Array<{ term: string; percentage: number }>>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
  const [allSubtypes, setAllSubtypes] = useState<Subtype[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [myBarSpirits, setMyBarSpirits] = useState<MyBarSpirit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of all nested data
  useEffect(() => {
    const fetchAllSpiritsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [typesData, subtypesData, brandsData] = await Promise.all([
          supabase.from('alcohol_types').select('*, history, fun_facts, myths, image_url'),
          supabase.from('subtypes').select('*, alcohol_types(name), history, fun_facts, myths, image_url, abv_min, abv_max, region, flavor_profile, characteristics, production_method'),
          supabase.from('brands').select('*, subtypes(name, alcohol_types(name)), history, fun_facts, myths, image_url, abv, tasting_notes, price_range')
        ]);

        if (typesData.error) throw typesData.error;
        if (subtypesData.error) throw subtypesData.error;
        if (brandsData.error) throw brandsData.error;

        // Process and set data
        const processedAlcoholTypes = typesData.data.map(type => ({
          ...type,
          image: type.image_url,
          subtypes: subtypesData.data
            .filter(sub => sub.alcohol_type_id === type.id)
            .map(sub => ({
              ...sub,
              image: sub.image_url,
              brands: brandsData.data.filter(brand => brand.subtype_id === sub.id)
                .map(brand => ({ ...brand, image: brand.image_url }))
            }))
        }));

        const processedSubtypes = subtypesData.data.map(sub => ({
          ...sub,
          image: sub.image_url,
          brands: brandsData.data.filter(brand => brand.subtype_id === sub.id)
            .map(brand => ({ ...brand, image: brand.image_url }))
        }));

        const processedBrands = brandsData.data.map(brand => ({
          ...brand,
          image: brand.image_url
        }));

        setAlcoholTypes(processedAlcoholTypes);
        setAllSubtypes(processedSubtypes);
        setAllBrands(processedBrands);
        
        // Load user's bar if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await loadMyBarSpirits();
        }
        
      } catch (err: any) {
        console.error('Error fetching spirits data:', err.message);
        setError(err.message || 'Failed to fetch spirits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllSpiritsData();
  }, []);

  // Existing methods
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
      return allSubtypes.filter(sub => sub.alcohol_type_id === categoryId);
    },
    [allSubtypes]
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
      return allBrands.filter(brand => brand.subtype_id === subtypeId);
    },
    [allBrands]
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

  // New filtering methods
  const getFilteredSpirits = useCallback((filters: Partial<FilterOptions>, searchQuery?: string) => {
    let filteredAlcoholTypes = [...alcoholTypes];
    let filteredSubtypes = [...allSubtypes];
    let filteredBrands = [...allBrands];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
        type.name.toLowerCase().includes(query) ||
        type.description.toLowerCase().includes(query)
      );
      filteredSubtypes = filteredSubtypes.filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        sub.description.toLowerCase().includes(query)
      );
      filteredBrands = filteredBrands.filter(brand =>
        brand.name.toLowerCase().includes(query) ||
        (brand.description && brand.description.toLowerCase().includes(query))
      );
    }

    // Apply region filter
    if (filters.regions && filters.regions.length > 0) {
      filteredSubtypes = filteredSubtypes.filter(sub =>
        filters.regions!.includes(sub.region)
      );
      // Filter alcohol types that have matching subtypes
      const matchingAlcoholTypeIds = new Set(filteredSubtypes.map(sub => sub.alcohol_type_id));
      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
        matchingAlcoholTypeIds.has(type.id)
      );
      // Filter brands that belong to matching subtypes
      const matchingSubtypeIds = new Set(filteredSubtypes.map(sub => sub.id));
      filteredBrands = filteredBrands.filter(brand =>
        matchingSubtypeIds.has(brand.subtype_id)
      );
    }

    // Apply flavor profile filter
    if (filters.flavorProfiles && filters.flavorProfiles.length > 0) {
      filteredSubtypes = filteredSubtypes.filter(sub =>
        sub.flavor_profile && sub.flavor_profile.some(fp =>
          filters.flavorProfiles!.includes(fp)
        )
      );
      filteredBrands = filteredBrands.filter(brand =>
        brand.tasting_notes && brand.tasting_notes.some(note =>
          filters.flavorProfiles!.includes(note)
        )
      );
    }

    // Apply ABV range filter
    if (filters.abvRanges && filters.abvRanges.length > 0) {
      const abvFilter = (abv: number | null) => {
        if (!abv) return false;
        return filters.abvRanges!.some(range => {
          switch (range) {
            case '<20%': return abv < 20;
            case '20-40%': return abv >= 20 && abv <= 40;
            case '40-60%': return abv > 40 && abv <= 60;
            case '>60%': return abv > 60;
            default: return false;
          }
        });
      };

      filteredSubtypes = filteredSubtypes.filter(sub =>
        abvFilter(sub.abv_min) || abvFilter(sub.abv_max)
      );
      filteredBrands = filteredBrands.filter(brand => abvFilter(brand.abv));
    }

    // Apply price range filter
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      filteredBrands = filteredBrands.filter(brand => {
        if (!brand.price_range) return false;
        const priceLevel = brand.price_range.split('-')[0]; // Get first part like "$30" from "$30-40"
        if (priceLevel.includes('$')) {
          const dollarCount = (priceLevel.match(/\$/g) || []).length;
          const priceCategory = '$'.repeat(Math.min(dollarCount, 3));
          return filters.priceRanges!.includes(priceCategory);
        }
        return false;
      });
    }

    return {
      alcoholTypes: filteredAlcoholTypes,
      subtypes: filteredSubtypes,
      brands: filteredBrands
    };
  }, [alcoholTypes, allSubtypes, allBrands]);

  const getAvailableFilterOptions = useCallback((): FilterOptions => {
    const regions = [...new Set(allSubtypes.map(sub => sub.region).filter(Boolean))];
    const flavorProfiles = [...new Set(allSubtypes.flatMap(sub => sub.flavor_profile || []))];
    const priceRanges = ['$', '$$', '$$$'];
    const abvRanges = ['<20%', '20-40%', '40-60%', '>60%'];
    
    // Extract age statements from brand names/descriptions
    const ageStatements = [...new Set(
      allBrands.flatMap(brand => {
        const ageMatches = brand.name.match(/(\d+)\s*(year|yr|YO)/gi) || [];
        return ageMatches.map(match => match.replace(/\s+/g, ' ').trim());
      })
    )];

    // Extract distillery names (simplified - could be more sophisticated)
    const distilleries = [...new Set(
      allBrands.map(brand => {
        // Extract potential distillery names from brand names
        const words = brand.name.split(' ');
        return words[0]; // Simple approach - take first word
      }).filter(Boolean)
    )];

    return {
      regions: regions.sort(),
      flavorProfiles: flavorProfiles.sort(),
      priceRanges,
      abvRanges,
      ageStatements: ageStatements.sort(),
      distilleries: distilleries.sort()
    };
  }, [allSubtypes, allBrands]);

  // My Bar functionality
  const loadMyBarSpirits = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_spirits')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Enrich with spirit data
      const enrichedSpirits = await Promise.all(
        (data || []).map(async (spirit) => {
          let spiritData = null;
          switch (spirit.spirit_type) {
            case 'alcohol_type':
              spiritData = alcoholTypes.find(at => at.id === spirit.spirit_id);
              break;
            case 'subtype':
              spiritData = allSubtypes.find(st => st.id === spirit.spirit_id);
              break;
            case 'brand':
              spiritData = allBrands.find(b => b.id === spirit.spirit_id);
              break;
          }
          return { ...spirit, spirit_data: spiritData };
        })
      );

      setMyBarSpirits(enrichedSpirits);
    } catch (error) {
      console.error('Error loading My Bar spirits:', error);
    }
  }, [alcoholTypes, allSubtypes, allBrands]);

  const addSpiritToMyBar = useCallback(async (spiritId: string, spiritType: 'alcohol_type' | 'subtype' | 'brand', notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_spirits')
        .insert({
          user_id: user.id,
          spirit_id: spiritId,
          spirit_type: spiritType,
          notes: notes || null
        });

      if (error) throw error;

      await loadMyBarSpirits();
    } catch (error) {
      console.error('Error adding spirit to My Bar:', error);
      throw error;
    }
  }, [loadMyBarSpirits]);

  const removeSpiritFromMyBar = useCallback(async (spiritId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_spirits')
        .delete()
        .eq('user_id', user.id)
        .eq('spirit_id', spiritId);

      if (error) throw error;

      await loadMyBarSpirits();
    } catch (error) {
      console.error('Error removing spirit from My Bar:', error);
      throw error;
    }
  }, [loadMyBarSpirits]);

  const updateMyBarNotes = useCallback(async (spiritId: string, notes: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_spirits')
        .update({ notes })
        .eq('user_id', user.id)
        .eq('spirit_id', spiritId);

      if (error) throw error;

      await loadMyBarSpirits();
    } catch (error) {
      console.error('Error updating My Bar notes:', error);
      throw error;
    }
  }, [loadMyBarSpirits]);

  const isInMyBar = useCallback((spiritId: string): boolean => {
    return myBarSpirits.some(spirit => spirit.spirit_id === spiritId);
  }, [myBarSpirits]);

  // Rating functionality
  const addRating = useCallback(async (brandId: string, rating: number, comment: string) => {
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
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }, []);

  const getRatingsForBrand = useCallback(async (brandId: string): Promise<Rating[]> => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('spirit_id', brandId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  }, []);

  const getTastingNotesForSpirit = useCallback(
    async (spiritId: string): Promise<Array<{ term: string; percentage: number }>> => {
      // This would typically aggregate tasting notes from ratings
      // For now, return empty array
      return [];
    },
    []
  );

  const contextValue = {
    alcoholTypes,
    allSubtypes,
    allBrands,
    myBarSpirits,
    loading,
    error,
    getCategoryById,
    getAlcoholTypeById,
    getSubtypesByCategoryId,
    getSubtypeById,
    getBrandsBySubtypeId,
    getBrandById,
    getFilteredSpirits,
    getAvailableFilterOptions,
    addSpiritToMyBar,
    removeSpiritFromMyBar,
    updateMyBarNotes,
    isInMyBar,
    loadMyBarSpirits,
    addRating,
    getRatingsForBrand,
    getTastingNotesForSpirit,
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