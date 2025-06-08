import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSpirits } from '../contexts/SpiritsContext'; // <-- Import useSpirits

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { brands, loading, error } = useSpirits();

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.producer?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirits for exploration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600 dark:text-red-400">Error loading spirits: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore Spirits
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover a wide range of spirits
        </p>

        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search spirits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBrands.map((brand) => (
          <Link
            key={brand.id}
            // --- THIS IS THE CRUCIAL CHANGE ---
            to={`/spirit/${brand.id}`} // <--- Make sure it's "/spirit/"
            // --- END CRUCIAL CHANGE ---
            className="block group"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-4">
                <img
                  src={brand.image || 'https://via.placeholder.com/150.png?text=Spirit'}
                  alt={brand.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {brand.origin || 'Unknown Origin'}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mt-4 line-clamp-3">
                {brand.description || 'No description available.'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No spirits found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;