// src/components/common/FilterModal.tsx
import React, { useState, useEffect } from 'react';
import { useSpirits } from '../../contexts/SpiritsContext'; // Adjust path if needed
import { FilterOptions } from '../../data/types'; // Assuming FilterOptions is also exported from types.ts or you define it here again

// Define FilterOptions type locally if it's not exported from data/types
// interface FilterOptions {
//   alcoholTypeNames: string[];
//   flavorProfiles: string[];
//   priceRanges: string[];
//   abvRanges: string[];
//   ageStatements: string[];
//   distilleries: string[];
// }

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  initialFilters: Partial<FilterOptions>; // To pre-populate filters if opened multiple times
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const { getAvailableFilterOptions } = useSpirits();
  const [availableOptions, setAvailableOptions] = useState<FilterOptions>({
    alcoholTypeNames: [],
    flavorProfiles: [],
    priceRanges: [],
    abvRanges: [],
    ageStatements: [],
    distilleries: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<Partial<FilterOptions>>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      // Fetch available options when the modal opens
      const options = getAvailableFilterOptions();
      setAvailableOptions(options);
      // Reset selected filters to initialFilters when opened
      setSelectedFilters(initialFilters);
    }
  }, [isOpen, getAvailableFilterOptions, initialFilters]);

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

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters: Partial<FilterOptions> = {
      alcoholTypeNames: [],
      flavorProfiles: [],
      priceRanges: [],
      abvRanges: [],
      ageStatements: [],
      distilleries: [],
    };
    setSelectedFilters(clearedFilters);
    onApplyFilters(clearedFilters); // Apply cleared filters immediately
    // onClose(); // Optionally close after clearing, or keep open
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Filter Spirits</h2>

        {/* Filter Group: Alcohol Types (formerly Regions) */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Spirit Types</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.alcoholTypeNames.map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedFilters.alcoholTypeNames?.includes(type) || false}
                  onChange={e => handleFilterChange('alcoholTypeNames', type, e.target.checked)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Flavor Profiles */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Flavor Profiles</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.flavorProfiles.map(profile => (
              <label key={profile} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedFilters.flavorProfiles?.includes(profile) || false}
                  onChange={e => handleFilterChange('flavorProfiles', profile, e.target.checked)}
                />
                <span>{profile}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: ABV Ranges */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">ABV Ranges</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.abvRanges.map(range => (
              <label key={range} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedFilters.abvRanges?.includes(range) || false}
                  onChange={e => handleFilterChange('abvRanges', range, e.target.checked)}
                />
                <span>{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Price Ranges */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Price Ranges</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableOptions.priceRanges.map(range => (
              <label key={range} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={selectedFilters.priceRanges?.includes(range) || false}
                  onChange={e => handleFilterChange('priceRanges', range, e.target.checked)}
                />
                <span>{range}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Group: Age Statements (if you implement this in your data) */}
        {availableOptions.ageStatements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Age Statements</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableOptions.ageStatements.map(age => (
                <label key={age} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedFilters.ageStatements?.includes(age) || false}
                    onChange={e => handleFilterChange('ageStatements', age, e.target.checked)}
                  />
                  <span>{age}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filter Group: Distilleries (if you implement this in your data) */}
        {availableOptions.distilleries.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Distilleries</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableOptions.distilleries.map(distillery => (
                <label key={distillery} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedFilters.distilleries?.includes(distillery) || false}
                    onChange={e => handleFilterChange('distilleries', distillery, e.target.checked)}
                  />
                  <span>{distillery}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;