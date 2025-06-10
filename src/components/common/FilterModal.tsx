import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';

interface FilterOptions {
  alcoholTypes: Array<{ id: string; name: string }>;
  subtypes: Array<{ id: string; name: string }>;
  priceRanges: string[];
  abvRanges: Array<{ min: number; max: number; label: string }>;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterCriteria>) => void;
  initialFilters: Partial<FilterCriteria>;
}

interface FilterCriteria {
  alcoholTypeIds?: string[];
  subtypeIds?: string[];
  priceRanges?: string[];
  abvRange?: { min: number; max: number };
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters
}) => {
  const { getAvailableFilterOptions } = useSpirits();
  const [selectedFilters, setSelectedFilters] = useState<Partial<FilterCriteria>>(initialFilters);
  const [availableOptions, setAvailableOptions] = useState<FilterOptions>({
    alcoholTypes: [],
    subtypes: [],
    priceRanges: [],
    abvRanges: []
  });

  useEffect(() => {
    if (isOpen) {
      const options = getAvailableFilterOptions();
      setAvailableOptions(options);
      setSelectedFilters(initialFilters);
    }
  }, [isOpen, getAvailableFilterOptions, initialFilters]);

  const handleFilterChange = (filterType: keyof FilterCriteria, value: string | { min: number; max: number }) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'abvRange') {
        newFilters.abvRange = value as { min: number; max: number };
      } else {
        const currentArray = (newFilters[filterType] as string[]) || [];
        const stringValue = value as string;
        
        if (currentArray.includes(stringValue)) {
          newFilters[filterType] = currentArray.filter(item => item !== stringValue) as any;
        } else {
          newFilters[filterType] = [...currentArray, stringValue] as any;
        }
      }
      
      return newFilters;
    });
  };

  const handleClearAll = () => {
    const emptyFilters = {};
    setSelectedFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-indigo-600">Filter Spirits</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Spirit Types */}
          {availableOptions.alcoholTypes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spirit Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableOptions.alcoholTypes.map(type => (
                  <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(selectedFilters.alcoholTypeIds || []).includes(type.id)}
                      onChange={() => handleFilterChange('alcoholTypeIds', type.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Subtypes */}
          {availableOptions.subtypes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subtypes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {availableOptions.subtypes.map(subtype => (
                  <label key={subtype.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(selectedFilters.subtypeIds || []).includes(subtype.id)}
                      onChange={() => handleFilterChange('subtypeIds', subtype.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{subtype.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ABV Ranges */}
          {availableOptions.abvRanges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ABV Ranges</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableOptions.abvRanges.map(range => (
                  <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="abvRange"
                      checked={selectedFilters.abvRange?.min === range.min && selectedFilters.abvRange?.max === range.max}
                      onChange={() => handleFilterChange('abvRange', { min: range.min, max: range.max })}
                      className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Ranges */}
          {availableOptions.priceRanges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Ranges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableOptions.priceRanges.map(range => (
                  <label key={range} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(selectedFilters.priceRanges || []).includes(range)}
                      onChange={() => handleFilterChange('priceRanges', range)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClearAll}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;