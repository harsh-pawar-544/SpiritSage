// Inside src/contexts/SpiritsContext.tsx

  const getSubtypeById = useCallback(
    async (id: string): Promise<Subtype | undefined> => {
      try {
        console.log(`Fetching subtype by ID: ${id}`);
        const { data, error } = await supabase
          .from('subtypes')
          .select('*') // Selects all columns, including alcohol_type_id
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

        // Get the parent alcohol type's name for display purposes in the UI
        let parentAlcoholType: { id: string; name: string } | null = null; // Changed type for clarity
        if (data?.alcohol_type_id) {
          try {
            const { data: alcoholTypeData } = await supabase
              .from('alcohol_types')
              .select('id, name') // Select ID as well
              .eq('id', data.alcohol_type_id)
              .single();
            if (alcoholTypeData) {
              parentAlcoholType = { id: alcoholTypeData.id, name: alcoholTypeData.name };
            }
          } catch (alcoholTypeError) {
            console.warn('Could not fetch alcohol type name for subtype:', alcoholTypeError);
          }
        }

        return data ? {
          ...data,
          image: data.image_url,
          // Assign the correct parent category data if fetched, otherwise null
          // Make sure your 'Subtype' type can handle this structure:
          alcohol_types: parentAlcoholType // This should be AlcoholType if you want the full object
        } as Subtype : undefined;
      } catch (err: any) {
        console.error(`Exception fetching subtype by ID ${id}:`, err);
        throw err;
      }
    },
    []
  );