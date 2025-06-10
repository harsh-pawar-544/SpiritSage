// src/contexts/SpiritsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct
import { AlcoholType, Subtype, Brand, Rating } from '../data/types'; // Import all necessary types

// Define the shape of the context's value
interface SpiritsContextType {
  alcoholTypes: AlcoholType[] | null;
  subtypes: Subtype[] | null;
  brands: Brand[] | null;
  loading: boolean;
  error: string | null;
  getAlcoholTypeById: (id: string) => Promise<AlcoholType | undefined>;
  getSubtypeById: (id: string) => Promise<Subtype | undefined>;
  getBrandById: (id: string) => Promise<Brand | undefined>;
  getRatingsForSpirit: (spiritId: string) => Promise<Rating[]>;
  addRating: (rating: Omit<Rating, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => Promise<Rating | null>;
  // Add other fetch functions as needed (e.g., getBrandsBySubtypeId, getSubtypesByAlcoholTypeId)
}

// Create the Context
const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

// Create the Provider Component
export const SpiritsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alcoholTypes, setAlcoholTypes] = useState<AlcoholType[] | null>(null);
  const [subtypes, setSubtypes] = useState<Subtype[] | null>(null);
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Functions ---

  const fetchAlcoholTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('alcohol_types')
        .select('*'); // Select all columns for detailed AlcoholType

      if (fetchError) throw fetchError;
      setAlcoholTypes(data || []);
    } catch (err: any) {
      console.error('Error fetching alcohol types:', err);
      setError(`Failed to load alcohol types: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubtypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('subtypes')
        .select(`
          *,
          alcohol_types (id, name)
        `); // Select all from subtypes and join alcohol_types (id, name)

      if (fetchError) throw fetchError;

      // Map the data to ensure 'alcohol_types' is a proper object
      const mappedData: Subtype[] = data?.map(st => ({
        ...st,
        alcohol_types: st.alcohol_types ? { id: st.alcohol_types.id, name: st.alcohol_types.name } : null
      })) || [];

      setSubtypes(mappedData);
    } catch (err: any) {
      console.error('Error fetching subtypes:', err);
      setError(`Failed to load subtypes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('brands')
        .select(`
          *,
          subtypes (
            id,
            name,
            alcohol_types (id, name)
          )
        `);

      if (fetchError) throw fetchError;

      // Map the data to ensure nested relationships are correctly typed
      const mappedData: Brand[] = data?.map(b => ({
        ...b,
        subtypes: b.subtypes ? {
          id: b.subtypes.id,
          name: b.subtypes.name,
          alcohol_types: b.subtypes.alcohol_types ? {
            id: b.subtypes.alcohol_types.id,
            name: b.subtypes.alcohol_types.name
          } : null
        } : null
      })) || [];

      setBrands(mappedData);
    } catch (err: any) {
      console.error('Error fetching brands:', err);
      setError(`Failed to load brands: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    console.log("SpiritsContext: Initial data fetch triggered.");
    fetchAlcoholTypes();
    fetchSubtypes();
    fetchBrands();
  }, [fetchAlcoholTypes, fetchSubtypes, fetchBrands]);

  // --- Individual Item Fetchers (for detail pages) ---

  const getAlcoholTypeById = useCallback(async (id: string): Promise<AlcoholType | undefined> => {
    console.log(`Fetching alcohol type by ID: ${id}`);
    const { data, error: fetchError } = await supabase
      .from('alcohol_types')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error(`Error fetching alcohol type by ID ${id}:`, fetchError);
      throw new Error(`Failed to fetch alcohol type: ${fetchError.message}`);
    }
    return data ? data as AlcoholType : undefined;
  }, []);

  const getSubtypeById = useCallback(
    async (id: string): Promise<Subtype | undefined> => {
      try {
        console.log(`Fetching subtype by ID: ${id}`);
        const { data, error } = await supabase
          .from('subtypes')
          .select(`
            *,
            alcohol_types (id, name)
          `) // Selects all columns and joins alcohol_types
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

        return data ? {
          ...data,
          // Map the joined alcohol_types data to the correct structure
          alcohol_types: data.alcohol_types ? { id: data.alcohol_types.id, name: data.alcohol_types.name } : null
        } as Subtype : undefined;
      } catch (err: any) {
        console.error(`Exception fetching subtype by ID ${id}:`, err);
        throw err;
      }
    },
    []
  );

  const getBrandById = useCallback(async (id: string): Promise<Brand | undefined> => {
    console.log(`Fetching brand by ID: ${id}`);
    const { data, error: fetchError } = await supabase
      .from('brands')
      .select(`
        *,
        subtypes (
          id,
          name,
          alcohol_types (id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(`Error fetching brand by ID ${id}:`, fetchError);
      throw new Error(`Failed to fetch brand: ${fetchError.message}`);
    }

    return data ? {
      ...data,
      subtypes: data.subtypes ? {
        id: data.subtypes.id,
        name: data.subtypes.name,
        alcohol_types: data.subtypes.alcohol_types ? {
          id: data.subtypes.alcohol_types.id,
          name: data.subtypes.alcohol_types.name
        } : null
      } : null
    } as Brand : undefined;
  }, []);

  const getRatingsForSpirit = useCallback(async (spiritId: string): Promise<Rating[]> => {
    console.log(`Fetching ratings for spirit ID: ${spiritId}`);
    const { data, error: fetchError } = await supabase
      .from('ratings')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq('spirit_id', spiritId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(`Error fetching ratings for spirit ${spiritId}:`, fetchError);
      throw new Error(`Failed to fetch ratings: ${fetchError.message}`);
    }

    return data ? data as Rating[] : [];
  }, []);

  const addRating = useCallback(async (ratingData: Omit<Rating, 'id' | 'created_at' | 'updated_at' | 'profiles'>): Promise<Rating | null> => {
    console.log("Adding new rating:", ratingData);
    const { data, error: insertError } = await supabase
      .from('ratings')
      .insert(ratingData)
      .select(`
        *,
        profiles (username, avatar_url)
      `) // Select the inserted data with profile details
      .single();

    if (insertError) {
      console.error('Error adding rating:', insertError);
      throw new Error(`Failed to add rating: ${insertError.message}`);
    }

    return data as Rating;
  }, []);


  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    alcoholTypes,
    subtypes,
    brands,
    loading,
    error,
    getAlcoholTypeById,
    getSubtypeById,
    getBrandById,
    getRatingsForSpirit,
    addRating,
  }), [
    alcoholTypes,
    subtypes,
    brands,
    loading,
    error,
    getAlcoholTypeById,
    getSubtypeById,
    getBrandById,
    getRatingsForSpirit,
    addRating,
  ]);

  return (
    <SpiritsContext.Provider value={contextValue}>
      {children}
    </SpiritsContext.Provider>
  );
};

// Custom hook to use the SpiritsContext
export const useSpirits = () => {
  const context = useContext(SpiritsContext);
  if (context === undefined) {
    throw new Error('useSpirits must be used within a SpiritsProvider');
  }
  return context;
};