// src/components/common/FilterModal.tsx (Conceptual modification)

import React, { useState, useEffect } from 'react';
// ... other imports

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onClear: () => void;
  options: {
    alcoholTypes: any[];
    // subtypes: any[]; // <--- This will likely be removed or ignored
    brands: any[];
    // ... other filter categories
  };
  initialFilters: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  options,
  initialFilters,
}) => {
  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  useEffect(() => {
    setCurrentFilters(initialFilters);
  }, [initialFilters]);

  if (!isOpen) return null; // Modal won't render if not open

  const handleChange = (category: string, value: string) => {
    setCurrentFilters((prev: any) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClear = () => {
    setCurrentFilters({}); // Reset all filters
    onClear(); // Call the parent clear handler
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-content">
        <h2>Filters</h2>

        {/* Alcohol Type Filter */}
        <div className="filter-group">
          <label htmlFor="modal-alcohol-type">Alcohol Type:</label>
          <select
            id="modal-alcohol-type"
            value={currentFilters.alcoholType || ''}
            onChange={(e) => handleChange('alcoholType', e.target.value)}
          >
            <option value="">All Types</option>
            {options.alcoholTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- REMOVE OR COMMENT OUT THIS ENTIRE BLOCK FOR SUBTYPES --- */}
        {/* <div className="filter-group">
          <label htmlFor="modal-subtype">Subtype:</label>
          <select
            id="modal-subtype"
            value={currentFilters.subtype || ''}
            onChange={(e) => handleChange('subtype', e.target.value)}
          >
            <option value="">All Subtypes</option>
            {options.subtypes && options.subtypes.map((subtype) => (
              <option key={subtype.id} value={subtype.name}>
                {subtype.name}
              </option>
            ))}
          </select>
        </div> */}
        {/* ----------------------------------------------------------- */}

        {/* Brand Filter (assuming it's here) */}
        <div className="filter-group">
          <label htmlFor="modal-brand">Brand:</label>
          <select
            id="modal-brand"
            value={currentFilters.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {options.brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button onClick={() => onApply(currentFilters)}>Apply Filters</button>
          <button onClick={handleClear}>Clear Filters</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;