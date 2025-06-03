import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'whiskies',
      title: 'Whiskies',
      emoji: '🥃',
      description: 'From smooth bourbon to peaty scotch, explore the world of whiskey.',
    },
    {
      id: 'rums',
      title: 'Rums',
      emoji: '🍹',
      description: 'Discover Caribbean spirits from white to dark aged varieties.',
    },
    {
      id: 'gins',
      title: 'Gins',
      emoji: '🌿',
      description: 'Experience botanical-infused gins from around the globe.',
    },
    {
      id: 'tequila',
      title: 'Tequila',
      emoji: '🌵',
      description: 'Explore the rich tradition of Mexico\'s iconic agave spirit.',
    },
    {
      id: 'brandy',
      title: 'Brandy',
      emoji: '🍷',
      description: 'Discover the world of distilled wine and fruit spirits.',
    },
    {
      id: 'cognac',
      title: 'Cognac',
      emoji: '🥂',
      description: 'Experience the luxury of France\'s premier brandy.',
    },
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Spirits
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse by category, mood, or flavor profile
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
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCategories.map((category) => (
          <Link
            key={category.id}
            to={`/spirit/${category.id}`}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-md p-8 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
              <div className="text-4xl mb-4">{category.emoji}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {category.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-lg">No spirits found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;