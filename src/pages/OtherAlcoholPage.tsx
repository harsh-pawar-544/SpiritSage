// src/pages/OtherAlcoholPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../contexts/SpiritsContext';
import TransitionImage from '../components/ui/TransitionImage';
import { ArrowLeft } from 'lucide-react';

// === ACTUAL IDs FROM YOUR SUPABASE DATABASE ===
const WINE_ALCOHOL_TYPE_ID = '150139eb-2374-4a05-b1fb-bf2920e9613e';
const BEER_ALCOHOL_TYPE_ID = '95262b6f-fd4b-4802-a06d-2744931caf75';
// ==============================================

const OtherAlcoholPage: React.FC = () => {
  const { alcoholTypes, loading, error } = useSpirits();

  // Filter to get only Wine and Beer alcohol types
  const otherAlcoholCategories = alcoholTypes.filter(
    (type) => type.id === WINE_ALCOHOL_TYPE_ID || type.id === BEER_ALCOHOL_TYPE_ID
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-nav">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading alcohol categories...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/explore"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Explore
      </Link>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Wines & Beers
      </h1>

      {otherAlcoholCategories.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No wine or beer categories found. Please ensure they are added in Supabase with the correct IDs.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherAlcoholCategories.map((type) => (
            <Link
              key={type.id}
              to={`/alcohol-type/${type.id}`} // Link to the AlcoholTypeDetailPage
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="w-full h-48 flex justify-center items-center bg-gray-100 dark:bg-gray-700">
                <TransitionImage
                  src={type.image_url || 'https://via.placeholder.co/200x200/cccccc/333333?text=No+Image'}
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
      )}
    </div>
  );
};

export default OtherAlcoholPage;