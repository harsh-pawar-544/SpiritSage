import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { spiritCategories } from '../../data/spiritCategories';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all spirits by flattening the categories array
  const allSpirits = spiritCategories.flatMap(category => 
    category.subtypes.map(spirit => ({
      ...spirit,
      categoryName: category.name
    }))
  );

  // Filter spirits based on search query
  const filteredSpirits = allSpirits.filter(spirit =>
    spirit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spirit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spirit.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore Spirits
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover our curated collection of fine spirits
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpirits.map((spirit) => (
          <Link
            key={spirit.id}
            to={`/spirit/${spirit.id}`}
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <TransitionImage
                  src={spirit.image}
                  alt={spirit.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm font-medium text-indigo-300 mb-1">
                    {spirit.categoryName}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{spirit.name}</h3>
                  <p className="text-gray-200 text-sm line-clamp-2">
                    {spirit.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredSpirits.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No spirits found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpiritListPage;