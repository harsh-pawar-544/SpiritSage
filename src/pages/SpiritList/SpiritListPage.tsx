import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Search } from 'lucide-react'; // SortAsc, SortDesc are not used in JSX, so removed for cleaner import

type SortOption = 'nameAsc' | 'nameDesc' | 'popularityAsc' | 'popularityDesc';

const SpiritListPage: React.FC = () => {
  const { alcoholTypes, loading, error } = useSpirits();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');

  const filteredAndSortedSpirits = useMemo(() => {
    let result = [...alcoholTypes];

    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(type =>
        type.name.toLowerCase().includes(query) ||
        type.description.toLowerCase().includes(query)
      );
    }

    // Sort based on selected option
    result.sort((a, b) => {
      switch (sortOption) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'popularityAsc':
          return (a.subtypes?.length || 0) - (b.subtypes?.length || 0);
        case 'popularityDesc':
          return (b.subtypes?.length || 0) - (a.subtypes?.length || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [alcoholTypes, searchQuery, sortOption]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Explore Spirits</h1> {/* Added theme classes */}

      <div className="mb-8 space-y-4">
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search spirits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-64">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
            >
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
              <option value="popularityDesc">Most Popular</option>
              <option value="popularityAsc">Least Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedSpirits.map((alcoholType) => {
          // *** IMPORTANT: CONSOLE LOG FOR DEBUGGING ***
          console.log(`Spirit: ${alcoholType.name}, ID: ${alcoholType.id}, Image URL:`, alcoholType.image_url);

          return (
            <Link
              key={alcoholType.id}
              to={`/alcohol-type/${alcoholType.id}`}
              className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[4/3]">
                  {/* *** CRITICAL FIX: Changed alcoholType.image to alcoholType.image_url *** */}
                  <TransitionImage
                    src={alcoholType.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'} // Fallback Pexels image if image_url is null
                    alt={alcoholType.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{alcoholType.name}</h3>
                    <p className="text-gray-200 line-clamp-2">{alcoholType.description}</p>
                    <div className="mt-2 text-sm text-gray-300">
                      {alcoholType.subtypes?.length || 0} varieties available
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredAndSortedSpirits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No spirits found matching your search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default SpiritListPage;