// src/pages/SpiritList/SpiritListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import TransitionImage from '../../components/ui/TransitionImage';
import { supabase } from '../../lib/supabaseClient'; // Import supabase client

// Define a type for your alcohol categories/types fetched from Supabase
interface AlcoholType {
  id: string; // This will be string representation of UUID or BIGINT from Supabase
  name: string;
  description: string; // Assuming you might add descriptions to alcohol_types later
  image: string; // Assuming you might add image URLs to alcohol_types later
}

const SpiritListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCategories, setAllCategories] = useState<AlcoholType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlcoholTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('alcohol_types')
          .select('*'); // Select all columns (id, name, etc.)

        if (error) {
          console.error('Error fetching alcohol types from Supabase:', error);
          setError('Failed to load categories. Please try again.');
          setAllCategories([]);
          return;
        }

        // Assuming your alcohol_types table has 'id' and 'name'.
        // If you want 'description' or 'image', you'll need to add those columns
        // to your 'alcohol_types' table in Supabase and re-import the CSV.
        // For now, let's map what we have and add placeholders for missing fields.
        const mappedCategories: AlcoholType[] = data.map(item => ({
          id: item.id.toString(), // Ensure ID is string for Link to
          name: item.name,
          description: item.description || `Explore the world of ${item.name}.`, // Placeholder
          image: item.image || `/images/categories/${item.name.toLowerCase().replace(/\s/g, '-')}.jpg`, // Placeholder/default
        }));

        setAllCategories(mappedCategories);
      } catch (err) {
        console.error('Unexpected error in fetchAlcoholTypes:', err);
        setError('An unexpected error occurred.');
        setAllCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlcoholTypes();
  }, []); // Run once on component mount

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore Spirits
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Browse by category, mood, or flavor profile
        </p>

        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..." // Updated placeholder
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="ml-2 text-lg text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 text-lg mt-8">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No categories found matching your search.</p>
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`} // This will now use the Supabase ID
              className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/3]">
                  <TransitionImage
                    src={category.image} // Uses image from mapped category
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">{category.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpiritListPage;