// src/contexts/SpiritsContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient'; // Make sure this path is correct!
import {
  type AlcoholType,
  type Subtype,
  type Brand,
  type Rating,
} from '../data/types';

interface SpiritsContextType {
  alcoholTypes: AlcoholType[];
  loading: boolean;
  error: string | null;
  getCategoryById: (id: string) => AlcoholType | undefined;
  getAlcoholTypeById: (id: string) => Promise<AlcoholType | undefined>;
  getSubtypesByCategoryId: (categoryId: string) => Subtype[];
  getSubtypeById: (id: string) => Promise<Subtype | undefined>; // <--- ADDED TO INTERFACE
  getBrandsBySubtypeId: (subtypeId: string) => Brand[];
  getBrandById: (brandId: string) => Promise<Brand | undefined>;
  addRating: (brandId: string, rating: number, comment: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => Promise<Rating[]>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<Array<{ term: string; percentage: number }>>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
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

  const getSubtypeById = useCallback( // This function is correctly defined here
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

  const getTastingNotesForSpirit = useCallback(
    async (spiritId: string): Promise<Array<{ term: string; percentage: number }>> => {
      console.log(`Fetching tasting notes for spirit: ${spiritId}`);
      return [];
    },
    []
  );

  const contextValue = {
    alcoholTypes,
    loading,
    error,
    getCategoryById,
    getAlcoholTypeById,
    getSubtypesByCategoryId,
    getSubtypeById, // <--- ADDED TO CONTEXT VALUE
    getBrandsBySubtypeId,
    getBrandById,
    addRating: async () => {}, // Placeholder if removed
    getRatingsForBrand: async () => [], // Placeholder if removed
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