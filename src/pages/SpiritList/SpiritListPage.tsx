// src/pages/SpiritList/SpiritListPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react'; // Not used in this component, but kept
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritListPage: React.FC = () => {
  // --- CHANGE MADE HERE ---
  // Destructure 'alcoholTypes' instead of 'spirits'
  const { alcoholTypes, loading, error } = useSpirits();

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
      <h1 className="text-4xl font-bold text-center mb-12">Explore Spirits</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- CHANGE MADE HERE --- */}
        {/* Map over 'alcoholTypes' now, and rename 'spirit' to 'alcoholType' for clarity */}
        {alcoholTypes.map((alcoholType) => (
          <Link
            key={alcoholType.id}
            to={`/category/${alcoholType.id}`} // Ensure your route matches '/category/:id'
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <TransitionImage
                  src={alcoholType.image} // Use alcoholType.image
                  alt={alcoholType.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{alcoholType.name}</h3>
                  <p className="text-gray-200 line-clamp-2">{alcoholType.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SpiritListPage;