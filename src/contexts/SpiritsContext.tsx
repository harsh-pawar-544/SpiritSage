import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
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
  getSubtypesByCategoryId: (categoryId: string) => Subtype[];
  getBrandsBySubtypeId: (subtypeId: string) => Brand[];
  getBrandById: (brandId: string) => Brand | undefined;
  addRating: (brandId: string, rating: number, comment: string) => Promise<void>;
  getRatingsForBrand: (brandId: string) => Promise<Rating[]>;
  getTastingNotesForSpirit: (spiritId: string) => Promise<Array<{ term: string; percentage: number }>>;
}

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlcoholData = async () => {
      try {
        const { data: typesData, error: typesError } = await supabase
          .from('alcohol_types')
          .select('*');
        if (typesError) throw typesError;

        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*, alcohol_types(name)');
        if (subtypesError) throw subtypesError;

        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*, subtypes(name, alcohol_types(name))');
        if (brandsError) throw brandsError;

        const processedAlcoholTypes = typesData.map(type => ({
          ...type,
          subtypes: subtypesData
            .filter(sub => sub.alcohol_type_id === type.id)
            .map(sub => ({
              ...sub,
              brands: brandsData.filter(brand => brand.subtype_id === sub.id)
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
      return alcoholTypes.find(cat => cat.id === id);
    },
    [alcoholTypes]
  );

  const getSubtypesByCategoryId = useCallback(
    (categoryId: string): Subtype[] => {
      const category = alcoholTypes.find(cat => cat.id === categoryId);
      return category ? category.subtypes : [];
    },
    [alcoholTypes]
  );

  const getBrandsBySubtypeId = useCallback(
    (subtypeId: string): Brand[] => {
      let brands: Brand[] = [];
      alcoholTypes.forEach(category => {
        const subtype = category.subtypes.find(sub => sub.id === subtypeId);
        if (subtype) {
          brands = subtype.brands;
        }
      });
      return brands;
    },
    [alcoholTypes]
  );

  const getBrandById = useCallback(
    (brandId: string): Brand | undefined => {
      let foundBrand: Brand | undefined;
      alcoholTypes.some(category =>
        category.subtypes.some(subtype =>
          subtype.brands.some(brand => {
            if (brand.id === brandId) {
              foundBrand = brand;
              return true;
            }
            return false;
          })
        )
      );
      return foundBrand;
    },
    [alcoholTypes]
  );

  const addRating = useCallback(
    async (brandId: string, rating: number, comment: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated.');
      }

      const { error: insertError } = await supabase
        .from('ratings')
        .insert({
          spirit_id: brandId,
          user_id: user.id,
          rating,
          comment,
        });

      if (insertError) {
        throw new Error(insertError.message || 'Failed to add rating.');
      }
    },
    []
  );

  const getRatingsForBrand = useCallback(
    async (brandId: string): Promise<Rating[]> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('ratings')
          .select(`*, profiles:user_id(username, avatar_url)`)
          .eq('spirit_id', brandId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw new Error(fetchError.message || 'Failed to fetch ratings.');
        }
        return data || [];
      } catch (err) {
        console.error('Error fetching ratings:', err);
        return [];
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
    getSubtypesByCategoryId,
    getBrandsBySubtypeId,
    getBrandById,
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