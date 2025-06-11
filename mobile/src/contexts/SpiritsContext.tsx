// src/contexts/SpiritsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  type AlcoholType,
  type Subtype,
  type Brand,
  type Rating,
} from '../data/types'; // Ensure this path is correct

interface FilterOptions {
  alcoholTypeNames: string[]; // Renamed from 'regions'
  flavorProfiles: string[];
  priceRanges: string[]; // Will now contain actual ranges like "$20-25"
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
  }, []); // Removed loadMyBarSpirits from dependency array to prevent infinite loop on first load

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
        (type.description && type.description.toLowerCase().includes(query)) // Ensure description exists
      );
      filteredSubtypes = filteredSubtypes.filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        (sub.description && sub.description.toLowerCase().includes(query)) // Ensure description exists
      );
      filteredBrands = filteredBrands.filter(brand =>
        brand.name.toLowerCase().includes(query) ||
        (brand.description && brand.description.toLowerCase().includes(query))
      );
    }

    // Apply alcohol type names filter (formerly regions)
    if (filters.alcoholTypeNames && filters.alcoholTypeNames.length > 0) {
      // Filter alcohol types by their name
      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
        filters.alcoholTypeNames!.includes(type.name)
      );

      // Now filter subtypes and brands that belong to these filtered alcohol types
      const matchingAlcoholTypeIds = new Set(filteredAlcoholTypes.map(type => type.id));
      filteredSubtypes = filteredSubtypes.filter(sub =>
        matchingAlcoholTypeIds.has(sub.alcohol_type_id)
      );
      filteredBrands = filteredBrands.filter(brand => {
        // Find the subtype of the brand
        const brandSubtype = allSubtypes.find(sub => sub.id === brand.subtype_id);
        return brandSubtype && matchingAlcoholTypeIds.has(brandSubtype.alcohol_type_id);
      });
    }

    // Apply flavor profile filter
    if (filters.flavorProfiles && filters.flavorProfiles.length > 0) {
      // Filter subtypes
      filteredSubtypes = filteredSubtypes.filter(sub =>
        sub.flavor_profile && sub.flavor_profile.some(fp =>
          filters.flavorProfiles!.includes(fp)
        )
      );
      // Filter brands: A brand's tasting notes should match any selected flavor profile
      filteredBrands = filteredBrands.filter(brand =>
        brand.tasting_notes && brand.tasting_notes.some((note: string) => // Ensure tasting_notes is an array of strings
          filters.flavorProfiles!.includes(note)
        )
      );
      // Filter alcohol types: If any of their subtypes or brands match flavor profile
      const matchingSubtypeIds = new Set(filteredSubtypes.map(sub => sub.id));
      const matchingAlcoholTypeIdsFromSubtypes = new Set(
        filteredSubtypes.map(sub => sub.alcohol_type_id)
      );
      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
        matchingAlcoholTypeIdsFromSubtypes.has(type.id) ||
        allSubtypes.some(sub =>
          sub.alcohol_type_id === type.id &&
          allBrands.some(brand =>
            brand.subtype_id === sub.id &&
            brand.tasting_notes &&
            brand.tasting_notes.some((note: string) =>
              filters.flavorProfiles!.includes(note)
            )
          )
        )
      );
    }

    // Apply ABV range filter
    if (filters.abvRanges && filters.abvRanges.length > 0) {
      const abvFilter = (abv: number | null | undefined, filterRanges: string[]) => {
        if (abv === null || abv === undefined) return false;
        return filterRanges.some(range => {
          switch (range) {
            case '0-20%': return abv >= 0 && abv < 20;
            case '20-40%': return abv >= 20 && abv < 40;
            case '40-60%': return abv >= 40 && abv <= 60; // FIX: Corrected typo 'abb' to 'abv'
            case '60%+': return abv > 60;
            default: return false;
          }
        });
      };

      filteredSubtypes = filteredSubtypes.filter(sub =>
        abvFilter(sub.abv_min, filters.abvRanges!) || abvFilter(sub.abv_max, filters.abvRanges!)
      );
      filteredBrands = filteredBrands.filter(brand => abvFilter(brand.abv, filters.abvRanges!));

      // Propagate ABV filter to alcohol types
      const matchingSubtypeIdsForAbv = new Set(filteredSubtypes.map(sub => sub.id));
      const matchingBrandsForAbv = new Set(filteredBrands.map(brand => brand.id));

      const alcoholTypesWithMatchingSubtypes = new Set(
          filteredSubtypes.filter(sub => matchingSubtypeIdsForAbv.has(sub.id)).map(sub => sub.alcohol_type_id)
      );

      const alcoholTypesWithMatchingBrands = new Set(
          filteredBrands.filter(brand => matchingBrandsForAbv.has(brand.id))
              .map(brand => allSubtypes.find(sub => sub.id === brand.subtype_id)?.alcohol_type_id)
              .filter(Boolean) as string[]
      );

      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
          alcoholTypesWithMatchingSubtypes.has(type.id) || alcoholTypesWithMatchingBrands.has(type.id)
      );
    }


    // Apply price range filter
    // Now directly matches the string from the dropdown
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      filteredBrands = filteredBrands.filter(brand =>
        brand.price_range && filters.priceRanges!.includes(brand.price_range)
      );
      // Propagate price filter to subtypes and alcohol types
      const matchingSubtypeIds = new Set(filteredBrands.map(brand => brand.subtype_id));
      filteredSubtypes = filteredSubtypes.filter(sub =>
        matchingSubtypeIds.has(sub.id)
      );
      const matchingAlcoholTypeIds = new Set(filteredSubtypes.map(sub => sub.alcohol_type_id));
      filteredAlcoholTypes = filteredAlcoholTypes.filter(type =>
        matchingAlcoholTypeIds.has(type.id)
      );
    }

    // Add other filters if you implement them (ageStatements, distilleries)
    // For now, these are not fully implemented for filtering logic
    if (filters.ageStatements && filters.ageStatements.length > 0) {
        // You'll need to implement logic to parse age from brand names/descriptions
        // For example: filteredBrands = filteredBrands.filter(brand => brand.name.includes(filters.ageStatements[0]));
    }
    if (filters.distilleries && filters.distilleries.length > 0) {
        // You'll need to implement logic to filter by distillery, likely a field on Brand or Subtype
        // For example: filteredBrands = filteredBrands.filter(brand => brand.distillery === filters.distilleries[0]);
    }


    return {
      alcoholTypes: filteredAlcoholTypes,
      subtypes: filteredSubtypes,
      brands: filteredBrands
    };
  }, [alcoholTypes, allSubtypes, allBrands]);

  const getAvailableFilterOptions = useCallback((): FilterOptions => {
    // Collect all unique alcohol type names
    const alcoholTypeNames = [...new Set(alcoholTypes.map(type => type.name))];
    
    // Collect all unique flavor profiles from subtypes
    const flavorProfiles = [...new Set(allSubtypes.flatMap(sub => sub.flavor_profile || []))];
    
    // Collect all unique price ranges from brands (e.g., "$15-20", "$30-40")
    const priceRanges = [...new Set(allBrands.map(brand => brand.price_range).filter(Boolean))].sort((a, b) => {
        // Simple alphanumeric sort, consider custom sorting for actual price values if needed
        const parsePrice = (range: string) => parseFloat(range.replace('$', '').split('-')[0]);
        return parsePrice(a) - parsePrice(b);
    });
    
    const abvRanges = ['0-20%', '20-40%', '40-60%', '60%+']; // These are fixed ranges for display

    // Extract age statements from brand names/descriptions
    const ageStatements = [...new Set(
      allBrands.flatMap(brand => {
        // Example: "10 Year", "12 YO", "Aged 15 yrs"
        const ageMatches = brand.name.match(/(\d+)\s*(year|yr|YO|yrs)/gi) || [];
        return ageMatches.map(match => match.replace(/\s+/g, ' ').trim());
      })
    )].sort();

    // Extract distillery names (simplified - could be more sophisticated)
    const distilleries = [...new Set(
      allBrands.map(brand => {
        // Placeholder: Assuming a 'distillery' field on brand or extracting from name
        // If you have a 'distillery_id' or 'distillery_name' field on 'brands' table, use that.
        // For example: return brand.distillery_name;
        // For now, keeping your existing simple approach:
        const words = brand.name.split(' ');
        return words[0]; // Simple approach - take first word
      }).filter(Boolean)
    )].sort();

    return {
      alcoholTypeNames: alcoholTypeNames.sort(), // Sort alphabetically
      flavorProfiles: flavorProfiles.sort(),     // Sort alphabetically
      priceRanges, // Already sorted by parsing
      abvRanges,
      ageStatements,
      distilleries
    };
  }, [alcoholTypes, allSubtypes, allBrands]);

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
  }, [alcoholTypes, allSubtypes, allBrands]); // Dependencies needed here as well for enrichment

  const addSpiritToMyBar = useCallback(async (spiritId: string, spiritType: 'alcohol_type' | 'subtype' | 'brand', notes?: string) => {
    try {
      const { data: { user } = {} } = await supabase.auth.getUser(); // Destructure with default empty object
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
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_spirits')
        .delete()
        const { error } = await supabase
        .from('user_spirits')
        .delete()
        .eq('id', userSpiritRecordId) // <-- TARGET THE PRIMARY KEY 'id' of the user_spirits record
        .eq('user_id', user.id);   

      if (error) throw error;

      await loadMyBarSpirits();
    } catch (error) {
      console.error('Error removing spirit from My Bar:', error);
      throw error;
    }
  }, [loadMyBarSpirits]);

  const updateMyBarNotes = useCallback(async (spiritId: string, notes: string) => {
    try {
      const { data: { user } = {} } = await supabase.auth.getUser();
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
      const { data: { user } = {} } = await supabase.auth.getUser();
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