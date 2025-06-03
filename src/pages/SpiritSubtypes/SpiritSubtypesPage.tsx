import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import TransitionImage from '../../components/ui/TransitionImage';
import { supabase } from '../../lib/supabaseClient';

interface Subtype {
  id: string;
  name: string;
  description: string;
  region: string;
  abv_min: number | null;
  abv_max: number | null;
  flavor_profile: string[];
  characteristics: string[];
  production_method: string | null;
}

const SpiritSubtypesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [subtypes, setSubtypes] = useState<Subtype[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCategoryAndSubtypes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, fetch the alcohol type by ID instead of name
        const { data: alcoholType, error: alcoholTypeError } = await supabase
          .from('alcohol_types')
          .select('*')
          .eq('id', id)
          .single();

        if (alcoholTypeError) {
          throw new Error('Error fetching alcohol type');
        }

        if (!alcoholType) {
          throw new Error('Category not found');
        }

        setCategoryName(alcoholType.name);

        // Then fetch all subtypes for this alcohol type
        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*')
          .eq('alcohol_type_id', alcoholType.id);

        if (subtypesError) {
          throw new Error('Error fetching subtypes');
        }

        setSubtypes(subtypesData || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndSubtypes();
  }, [id]);

  const filteredSubtypes = subtypes.filter(subtype =>
    subtype.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subtype.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subtype.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {categoryName} Varieties
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Explore different styles and regional variations
        </p>

        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search varieties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading varieties...</div>
        </div>
      ) : filteredSubtypes.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No varieties found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubtypes.map((subtype) => (
            <Link
              key={subtype.id}
              to={`/spirit/${subtype.id}`}
              className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/3]">
                  <TransitionImage
                    src={`https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg`}
                    alt={subtype.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{subtype.name}</h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {subtype.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {subtype.flavor_profile.slice(0, 3).map((flavor, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-white/20 text-white rounded-full"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
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

export default SpiritSubtypesPage;