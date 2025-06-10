import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useAuth } from '../../contexts/AuthContext';
import TransitionImage from '../../components/ui/TransitionImage';
import FilterModal from '../../components/common/FilterModal';
import { Search, Filter, Bookmark, BookmarkCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

// === ACTUAL IDs FROM YOUR SUPABASE DATABASE ===
const WINE_ALCOHOL_TYPE_ID = '150139eb-2374-4a05-b1fb-bf2920e9613e';
const BEER_ALCOHOL_TYPE_ID = '95262b6f-fd4b-4802-a06d-2744931caf75';
// ==============================================

type SortOption = 'nameAsc' | 'nameDesc' | 'popularityAsc' | 'popularityDesc';

interface FilterCriteria {
  alcoholTypeIds?: string[];
  subtypeIds?: string[];
  priceRanges?: string[];
  abvRange?: { min: number; max: number };
  searchTerm?: string;
}

const SpiritListPage: React.FC = () => {
  const { 
    alcoholTypes, 
    loading, 
    error, 
    getFilteredSpirits,
    addSpiritToMyBar,
    isInMyBar 
  } = useSpirits();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Partial<FilterCriteria>>({});
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Filter out Wine and Beer from the main alcoholTypes for display
  const spiritCategories = alcoholTypes.filter(
    (type) => type.id !== WINE_ALCOHOL_TYPE_ID && type.id !== BEER_ALCOHOL_TYPE_ID
  );

  // Apply filters and search
  useEffect(() => {
    const filters = {
      ...currentFilters,
      searchTerm: searchQuery
    };

    if (Object.keys(currentFilters).length > 0 || searchQuery) {
      const results = getFilteredSpirits(filters);
      // Filter out wine and beer from results
      const spiritResults = results.filter(item => {
        if ('alcohol_type_id' in item) {
          // This is a brand or subtype, check its alcohol type
          return item.alcohol_type_id !== WINE_ALCOHOL_TYPE_ID && 
                 item.alcohol_type_id !== BEER_ALCOHOL_TYPE_ID;
        } else {
          // This is an alcohol type
          return item.id !== WINE_ALCOHOL_TYPE_ID && item.id !== BEER_ALCOHOL_TYPE_ID;
        }
      });
      setFilteredResults(spiritResults);
    } else {
      setFilteredResults([]);
    }
  }, [currentFilters, searchQuery, getFilteredSpirits]);

  const filteredAndSortedSpirits = useMemo(() => {
    const displayResults = Object.keys(currentFilters).length > 0 || searchQuery;
    
    if (displayResults) {
      // Sort filtered results
      const sorted = [...filteredResults].sort((a, b) => {
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
      return sorted;
    } else {
      // Sort spirit categories for default view
      const sorted = [...spiritCategories].sort((a, b) => {
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
      return sorted;
    }
  }, [filteredResults, spiritCategories, sortOption, currentFilters, searchQuery]);

  const handleApplyFilters = (filters: Partial<FilterCriteria>) => {
    setCurrentFilters(filters);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setCurrentFilters({});
    setFilteredResults([]);
  };

  const handleAddToMyBar = async (item: any) => {
    if (!user) {
      toast.error('Please sign in to add spirits to your bar');
      return;
    }

    try {
      // Determine spirit type based on item properties
      let spiritType: 'alcohol_type' | 'subtype' | 'brand';
      if ('subtype_id' in item && item.subtype_id) {
        spiritType = 'brand';
      } else if ('alcohol_type_id' in item && item.alcohol_type_id) {
        spiritType = 'subtype';
      } else {
        spiritType = 'alcohol_type';
      }

      await addSpiritToMyBar(item.id, spiritType);
      toast.success(`${item.name} added to your bar!`);
    } catch (error) {
      toast.error('Failed to add to your bar');
    }
  };

  const getItemLink = (item: any) => {
    if ('subtype_id' in item && item.subtype_id) {
      return `/spirit/${item.id}`; // Brand
    } else if ('alcohol_type_id' in item && item.alcohol_type_id) {
      return `/subtype/${item.id}`; // Subtype
    } else {
      return `/alcohol-type/${item.id}`; // Alcohol Type
    }
  };

  const getItemType = (item: any) => {
    if ('subtype_id' in item && item.subtype_id) {
      return 'brand';
    } else if ('alcohol_type_id' in item && item.alcohol_type_id) {
      return 'subtype';
    } else {
      return 'alcohol_type';
    }
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0 || searchQuery;
  const displayResults = hasActiveFilters;

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
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Explore Spirits</h1>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
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

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              Object.keys(currentFilters).length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-5 w-5" />
            {Object.keys(currentFilters).length > 0 ? 'Edit Filters' : 'Filter Spirits'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="flex items-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="h-5 w-5" />
              Clear All
            </button>
          )}

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

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Search: "{searchQuery}"
                </span>
              )}
              {currentFilters.alcoholTypeIds?.map(id => {
                const type = alcoholTypes.find(t => t.id === id);
                return type ? (
                  <span key={id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Type: {type.name}
                  </span>
                ) : null;
              })}
              {currentFilters.priceRanges?.map(range => (
                <span key={range} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Price: {range}
                </span>
              ))}
              {currentFilters.abvRange && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  ABV: {currentFilters.abvRange.min}-{currentFilters.abvRange.max}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {displayResults ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search Results ({filteredAndSortedSpirits.length})
            </h2>
          </div>
          {filteredAndSortedSpirits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No spirits found matching your criteria
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedSpirits.map((item) => (
                <div key={item.id} className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                    <Link to={getItemLink(item)} className="block">
                      <div className="relative aspect-[4/3]">
                        <TransitionImage
                          src={item.image_url || item.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                          <p className="text-gray-200 line-clamp-2">{item.description}</p>
                          <div className="mt-2 text-sm text-gray-300">
                            {getItemType(item) === 'alcohol_type' && `${item.subtypes?.length || 0} varieties`}
                            {getItemType(item) === 'subtype' && `${item.brands?.length || 0} brands`}
                            {getItemType(item) === 'brand' && item.abv && `${item.abv}% ABV`}
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <button
                        onClick={() => handleAddToMyBar(item)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isInMyBar(item.id, getItemType(item) as any)
                            ? 'bg-green-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                        disabled={isInMyBar(item.id, getItemType(item) as any)}
                      >
                        {isInMyBar(item.id, getItemType(item) as any) ? (
                          <>
                            <BookmarkCheck className="h-4 w-4" />
                            In My Bar
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-4 w-4" />
                            Add to My Bar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Spirit Categories ({spiritCategories.length})
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Apply filters or use the search bar to find specific spirits
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSpirits.map((alcoholType) => (
              <div key={alcoholType.id} className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                  <Link to={`/alcohol-type/${alcoholType.id}`} className="block">
                    <div className="relative aspect-[4/3]">
                      <TransitionImage
                        src={alcoholType.image_url || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'}
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
                  </Link>
                  
                  <div className="p-4">
                    <button
                      onClick={() => handleAddToMyBar(alcoholType)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isInMyBar(alcoholType.id, 'alcohol_type')
                          ? 'bg-green-600 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                      disabled={isInMyBar(alcoholType.id, 'alcohol_type')}
                    >
                      {isInMyBar(alcoholType.id, 'alcohol_type') ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          In My Bar
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Add to My Bar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={currentFilters}
      />
    </div>
  );
};

export default SpiritListPage;