import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useAuth } from '../../contexts/AuthContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Search, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';

type SortOption = 'nameAsc' | 'nameDesc' | 'popularityAsc' | 'popularityDesc';

interface FilterOptions {
  regions: string[];
  flavorProfiles: string[];
  priceRanges: string[];
  abvRanges: string[];
  ageStatements: string[];
  distilleries: string[];
}

const SpiritListPage: React.FC = () => {
  const { 
    alcoholTypes, 
    loading, 
    error, 
    getFilteredSpirits, 
    getAvailableFilterOptions,
    addSpiritToMyBar,
    isInMyBar 
  } = useSpirits();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedFlavorProfiles, setSelectedFlavorProfiles] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedAbvRanges, setSelectedAbvRanges] = useState<string[]>([]);
  const [selectedAgeStatements, setSelectedAgeStatements] = useState<string[]>([]);
  const [selectedDistilleries, setSelectedDistilleries] = useState<string[]>([]);

  const filterOptions = getAvailableFilterOptions();

  const filteredAndSortedSpirits = useMemo(() => {
    const filters = {
      regions: selectedRegions,
      flavorProfiles: selectedFlavorProfiles,
      priceRanges: selectedPriceRanges,
      abvRanges: selectedAbvRanges,
      ageStatements: selectedAgeStatements,
      distilleries: selectedDistilleries,
    };

    const filtered = getFilteredSpirits(filters, searchQuery);
    let result = [...filtered.alcoholTypes];

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
  }, [alcoholTypes, searchQuery, sortOption, selectedRegions, selectedFlavorProfiles, selectedPriceRanges, selectedAbvRanges, selectedAgeStatements, selectedDistilleries, getFilteredSpirits]);

  const toggleFilter = (filterType: keyof FilterOptions, value: string) => {
    const setters = {
      regions: setSelectedRegions,
      flavorProfiles: setSelectedFlavorProfiles,
      priceRanges: setSelectedPriceRanges,
      abvRanges: setSelectedAbvRanges,
      ageStatements: setSelectedAgeStatements,
      distilleries: setSelectedDistilleries,
    };

    const currentLists = {
      regions: selectedRegions,
      flavorProfiles: selectedFlavorProfiles,
      priceRanges: selectedPriceRanges,
      abvRanges: selectedAbvRanges,
      ageStatements: selectedAgeStatements,
      distilleries: selectedDistilleries,
    };

    const setter = setters[filterType];
    const currentList = currentLists[filterType];

    setter((prev: string[]) =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedFlavorProfiles([]);
    setSelectedPriceRanges([]);
    setSelectedAbvRanges([]);
    setSelectedAgeStatements([]);
    setSelectedDistilleries([]);
  };

  const handleAddToMyBar = async (alcoholType: any) => {
    if (!user) {
      toast.error('Please sign in to add spirits to your bar');
      return;
    }

    try {
      await addSpiritToMyBar(alcoholType.id, 'alcohol_type');
      toast.success(`${alcoholType.name} added to your bar!`);
    } catch (error) {
      toast.error('Failed to add to your bar');
    }
  };

  const renderFilterChips = (options: string[], selected: string[], filterType: keyof FilterOptions) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map(option => (
        <button
          key={option}
          onClick={() => toggleFilter(filterType, option)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selected.includes(option)
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

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
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>

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
                    isInMyBar(alcoholType.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  disabled={isInMyBar(alcoholType.id)}
                >
                  {isInMyBar(alcoholType.id) ? (
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

      {filteredAndSortedSpirits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No spirits found matching your search criteria
          </p>
        </div>
      )}

      {/* Filter Modal */}
      <Dialog.Root open={showFilterModal} onOpenChange={setShowFilterModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6 overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Filter Spirits
            </Dialog.Title>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Region</h3>
                {renderFilterChips(filterOptions.regions, selectedRegions, 'regions')}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Flavor Profile</h3>
                {renderFilterChips(filterOptions.flavorProfiles, selectedFlavorProfiles, 'flavorProfiles')}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Price Range</h3>
                {renderFilterChips(filterOptions.priceRanges, selectedPriceRanges, 'priceRanges')}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">ABV Range</h3>
                {renderFilterChips(filterOptions.abvRanges, selectedAbvRanges, 'abvRanges')}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Age Statements</h3>
                {renderFilterChips(filterOptions.ageStatements, selectedAgeStatements, 'ageStatements')}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Distilleries</h3>
                {renderFilterChips(filterOptions.distilleries.slice(0, 20), selectedDistilleries, 'distilleries')}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>

            <Dialog.Close className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <span className="sr-only">Close</span>
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default SpiritListPage;