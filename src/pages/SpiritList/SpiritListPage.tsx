import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Search, SortAsc, SortDesc } from 'lucide-react';

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
    {/* ... other parts of your code ... */}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedSpirits.map((alcoholType) => {
        // ADD THIS CONSOLE LOG:
        console.log(`Spirit: ${alcoholType.name}, Image URL:`, alcoholType.image_url);

        return (
          <Link
            key={alcoholType.id}
            to={`/alcohol-type/${alcoholType.id}`}
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <TransitionImage
                  src={alcoholType.image_url} // Ensure this is `alcoholType.image_url`
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

    {/* ... (no spirits found message) */}
  </div>
);
};

export default SpiritListPage;