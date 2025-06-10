// src/pages/BrowseSpiritsPage.tsx
import React, { useState, useEffect } from 'react';
import { useSpirits } from '../contexts/SpiritsContext'; // Adjust path if needed
import {
  type AlcoholType,
  type Subtype,
  type Brand,
} from '../data/types'; // Ensure this path is correct

// Define FilterOptions type locally if it's not exported from data/types
interface FilterOptions {
  alcoholTypeNames: string[];
  flavorProfiles: string[];
  priceRanges: string[];
  abvRanges: string[];
  ageStatements: string[];
  distilleries: string[];
}

// Helper to determine if a filter object is empty
const areFiltersEmpty = (filters: Partial<FilterOptions>) => {
  return (
    Object.keys(filters).every(key => {
      const value = filters[key as keyof FilterOptions];
      return !value || value.length === 0;
    })
  );
};

const BrowseSpiritsPage: React.FC = () => {
  const { loading, error, getFilteredSpirits, getAvailableFilterOptions } = useSpirits();

  const [selectedFilters, setSelectedFilters] = useState<Partial<FilterOptions>>({
    alcoholTypeNames: [],
    flavorProfiles: [],
    priceRanges: [],
    abvRanges: [],
    ageStatements: [],
    distilleries: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

  // State for available filter options (fetched once)
  const [availableOptions, setAvailableOptions] = useState<FilterOptions>({
    alcoholTypeNames: [],
    flavorProfiles: [],
    priceRanges: [],
    abvRanges: [],
    ageStatements: [],
    distilleries: [],
  });

  // State to hold the filtered results
  const [filteredAlcoholTypes, setFilteredAlcoholTypes] = useState<AlcoholType[]>([]);
  const [filteredSubtypes, setFilteredSubtypes] = useState<Subtype[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  // Fetch available filter options on initial load
  useEffect(() => {
    if (!loading && !error) {
      setAvailableOptions(getAvailableFilterOptions());
    }
  }, [loading, error, getAvailableFilterOptions]);

  // Effect to apply filters whenever selectedFilters or searchQuery changes
  useEffect(() => {
    if (!loading && !error) {
      const { alcoholTypes, subtypes, brands } = getFilteredSpirits(selectedFilters, searchQuery);
      setFilteredAlcoholTypes(alcoholTypes);
      setFilteredSubtypes(subtypes);
      setFilteredBrands(brands);
    }
  }, [selectedFilters, searchQuery, getFilteredSpirits, loading, error]);

  const handleFilterChange = (
    category: keyof FilterOptions,
    value: string,
    isChecked: boolean
  ) => {
    setSelectedFilters(prevFilters => {
      const currentValues = prevFilters[category] || [];
      if (isChecked) {
        return {
          ...prevFilters,
          [category]: [...new Set([...currentValues, value])], // Add value if checked
        };
      } else {
        return {
          ...prevFilters,
          [category]: currentValues.filter(item => item !== value), // Remove value if unchecked
        };
      }
    });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilters({
      alcoholTypeNames: [],
      flavorProfiles: [],
      priceRanges: [],
      abvRanges: [],
      ageStatements: [],
      distilleries: [],
    });
  };

  if (loading) return <div className="text-center p-8">Loading spirits data...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  // Determine if any filters are active for display purposes
  const filtersAreActive = !areFiltersEmpty(selectedFilters) || searchQuery.length > 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Spirits</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search spirits, types, brands..."
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600" // CHANGED: Focus ring color
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Clear Filters Button */}
      {filtersAreActive && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleClearAllFilters}
            className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-md shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-150 ease-in-out" // CHANGED: Text and Border color
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Filter Group: Spirit Types */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Spirit Types</h3> {/* CHANGED: Heading color */}
          <div className="max-h-48 overflow-y-auto">
            {availableOptions.alcoholTypeNames.map(type => (
              <label key={type} className="flex items-center space-x-2 mb-1 text-gray-800">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                  checked={selectedFilters.alcoholTypeNames?.includes(type) || false}
                  onChange={e => handleFilterChange('alcoholTypeNames', type, e.target.checked)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Flavor Profiles */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Flavor Profiles</h3> {/* CHANGED: Heading color */}
          <div className="max-h-48 overflow-y-auto">
            {availableOptions.flavorProfiles.map(profile => (
              <label key={profile} className="flex items-center space-x-2 mb-1 text-gray-800">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                  checked={selectedFilters.flavorProfiles?.includes(profile) || false}
                  onChange={e => handleFilterChange('flavorProfiles', profile, e.target.checked)}
                />
                <span>{profile}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: ABV Ranges */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">ABV Ranges</h3> {/* CHANGED: Heading color */}
          <div>
            {availableOptions.abvRanges.map(range => (
              <label key={range} className="flex items-center space-x-2 mb-1 text-gray-800">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                  checked={selectedFilters.abvRanges?.includes(range) || false}
                  onChange={e => handleFilterChange('abvRanges', range, e.target.checked)}
                />
                <span>{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Price Ranges */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Price Ranges</h3> {/* CHANGED: Heading color */}
          <div className="max-h-48 overflow-y-auto">
            {availableOptions.priceRanges.map(range => (
              <label key={range} className="flex items-center space-x-2 mb-1 text-gray-800">
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                  checked={selectedFilters.priceRanges?.includes(range) || false}
                  onChange={e => handleFilterChange('priceRanges', range, e.target.checked)}
                />
                <span>{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Age Statements (only if available) */}
        {availableOptions.ageStatements.length > 0 && (
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Age Statements</h3> {/* CHANGED: Heading color */}
            <div className="max-h-48 overflow-y-auto">
              {availableOptions.ageStatements.map(age => (
                <label key={age} className="flex items-center space-x-2 mb-1 text-gray-800">
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                    checked={selectedFilters.ageStatements?.includes(age) || false}
                    onChange={e => handleFilterChange('ageStatements', age, e.target.checked)}
                  />
                  <span>{age}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filter Group: Distilleries (only if available) */}
        {availableOptions.distilleries.length > 0 && (
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Distilleries</h3> {/* CHANGED: Heading color */}
            <div className="max-h-48 overflow-y-auto">
              {availableOptions.distilleries.map(distillery => (
                <label key={distillery} className="flex items-center space-x-2 mb-1 text-gray-800">
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 focus:ring-indigo-500" // Added checkbox color
                    checked={selectedFilters.distilleries?.includes(distillery) || false}
                    onChange={e => handleFilterChange('distilleries', distillery, e.target.checked)}
                  />
                  <span>{distillery}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message when no filters are active */}
      {!filtersAreActive && (
        <p className="text-center text-gray-600 italic my-8">
          Select filters above or use the search bar to find spirits.
        </p>
      )}

      {/* Message when no results found */}
      {filteredAlcoholTypes.length === 0 && filteredSubtypes.length === 0 && filteredBrands.length === 0 && filtersAreActive && (
        <p className="text-center text-gray-600 text-lg my-8">
          No spirits found matching the selected filters and search query.
        </p>
      )}

      {/* Display Filtered Results */}

      {/* Alcohol Types Section */}
      {filteredAlcoholTypes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Alcohol Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlcoholTypes.map(type => (
              <div key={type.id} className="border rounded-lg shadow-md p-4 bg-white">
                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                {type.image && <img src={type.image} alt={type.name} loading="lazy" className="w-full h-48 object-cover rounded-md mb-3" />}
                <p className="text-gray-700 text-sm line-clamp-3">{type.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Subtypes Section */}
      {filteredSubtypes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Subtypes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubtypes.map(subtype => (
              <div key={subtype.id} className="border rounded-lg shadow-md p-4 bg-white">
                <h3 className="text-xl font-semibold mb-2">{subtype.name}</h3>
                {subtype.image && <img src={subtype.image} alt={subtype.name} loading="lazy" className="w-full h-48 object-cover rounded-md mb-3" />}
                <p className="text-gray-700 text-sm line-clamp-3">{subtype.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Flavor: {subtype.flavor_profile?.join(', ')} | ABV: {subtype.abv_min}-{subtype.abv_max}%
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brands Section */}
      {filteredBrands.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map(brand => (
              <div key={brand.id} className="border rounded-lg shadow-md p-4 bg-white">
                <h3 className="text-xl font-semibold mb-2">{brand.name}</h3>
                {brand.image && <img src={brand.image} alt={brand.name} loading="lazy" className="w-full h-48 object-cover rounded-md mb-3" />}
                <p className="text-gray-700 text-sm line-clamp-3">{brand.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  ABV: {brand.abv}% | Price: {brand.price_range}
                </p>
                <p className="text-sm text-gray-600">
                  Tasting Notes: {brand.tasting_notes?.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BrowseSpiritsPage;