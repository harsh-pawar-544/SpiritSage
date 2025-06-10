// src/pages/ExplorePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../contexts/SpiritsContext';
import { AlcoholType, Brand, Subtype } from '../data/types';
import TransitionImage from '../components/ui/TransitionImage';
import FilterModal from '../components/common/FilterModal';
import { Search, SlidersHorizontal } from 'lucide-react';

// === ACTUAL IDs FROM YOUR SUPABASE DATABASE ===
const WINE_ALCOHOL_TYPE_ID = '150139eb-2374-4a05-b1fb-bf2920e9613e';
const BEER_ALCOHOL_TYPE_ID = '95262b6f-fd4b-4802-a06d-2744931caf75';
// ==============================================

const ExplorePage: React.FC = () => {
  const {
    alcoholTypes,
    brands, // This is a flattened list of all brands, including wine and beer
    loading,
    error,
    getFilteredSpirits,
    getAvailableFilterOptions,
  } = useSpirits();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<any>({});
  const [filteredResults, setFilteredResults] = useState<Array<AlcoholType | Subtype | Brand>>([]);

  // Filter out Wine and Beer from the main alcoholTypes for display
  const spiritCategories = alcoholTypes.filter(
    (type) => type.id !== WINE_ALCOHOL_TYPE_ID && type.id !== BEER_ALCOHOL_TYPE_ID
  );

  useEffect(() => {
    // Only apply filters if there are active criteria or a search term
    if (Object.keys(filterCriteria).length > 0 || searchTerm) {
      const allFiltered = getFilteredSpirits({ ...filterCriteria, searchTerm });
      setFilteredResults(allFiltered);
    } else {
      setFilteredResults([]); // Clear results if no filters/search
    }
  }, [filterCriteria, searchTerm, getFilteredSpirits]);

  const handleApplyFilters = (filters: any) => {
    setFilterCriteria(filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCriteria({});
    setFilteredResults([]); // Clear search results and filters
    setIsFilterModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-nav">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen-minus-nav text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Determine what to display: filtered results or default categories/brands
  const displayResults = Object.keys(filterCriteria).length > 0 || searchTerm !== '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Explore Alcohols
      </h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search spirits, brands, subtypes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <SlidersHorizontal size={20} className="mr-2" />
          Filters
        </button>
      </div>

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          options={getAvailableFilterOptions()}
          initialFilters={filterCriteria}
        />
      )}

      {displayResults ? (
        // Display filtered results
        <>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h2>
          {filteredResults.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center">No results found for your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredResults.map((item) => (
                <Link
                  key={item.id}
                  // Link to the appropriate detail page based on item type
                  to={
                    'alcohol_type' in item
                      ? `/alcohol-type/${item.id}`
                      : 'subtype_id' in item // Check for subtype_id implies it's a brand
                      ? `/spirit/${item.id}` // This is a brand
                      : `/subtype/${item.id}` // This is a subtype
                  }
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="w-full h-48 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
                    <TransitionImage
                      src={item.image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      width={200}
                      height={200}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {'abv' in item && item.abv ? `${item.abv}% ABV` : 'N/A'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        // Display default categories and 'Other Alcohol' section
        <>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Spirit Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {spiritCategories.map((type) => (
              <Link
                key={type.id}
                to={`/alcohol-type/${type.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="w-full h-48 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
                  <TransitionImage
                    src={type.image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                    alt={type.name}
                    className="max-h-full max-w-full object-contain"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{type.name}</h3>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Other Alcohol</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Hardcoded card for Other Alcohol */}
            <Link
              to="/other-alcohol"
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col justify-center items-center text-center p-4 h-64"
            >
              <img
                src="https://via.placeholder.co/400x300/6A7D9D/ffffff?text=Other+Alcohol" // Placeholder image for Other Alcohol
                alt="Other Alcohol"
                className="max-h-32 mb-4 object-contain"
              />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Wines & Beers</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Explore various wines and beers.</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ExplorePage;