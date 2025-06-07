// src/components/RecommendedSpirits.tsx
import React from 'react';
import { Info, X } from 'lucide-react';
import { useRecommendations } from '../contexts/RecommendationsContext';
// Removed useSpirits, as getRatingsForBrand is no longer directly used here.
// Removed TransitionImage as it's now in RecommendedSpiritCard.
import { getSpiritById } from '../data/spiritCategories'; // Still needed for mapping spirit IDs to full objects
import RecommendedSpiritCard from './RecommendedSpiritCard'; // Import the new component

const RecommendedSpirits: React.FC = () => {
  const { recommendedSpirits, clearInteractionHistory, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  // Ensure getSpiritById correctly retrieves the full spirit object
  // It's crucial that the 'spiritId' from recommendations matches an ID in spiritCategories
  const validSpirits = recommendedSpirits
    .map(spiritId => getSpiritById(spiritId))
    .filter((spirit): spirit is NonNullable<typeof spirit> => spirit !== undefined);

  if (validSpirits.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <div className="group relative">
            <Info className="w-5 h-5 text-gray-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              Based on your ratings, views, and favorites
            </div>
          </div>
        </div>
        <button
          onClick={clearInteractionHistory}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
          <span>Clear recommendations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validSpirits.map(spirit => (
          // Pass the spirit object and use its ID as the key
          <RecommendedSpiritCard key={spirit.id} spirit={spirit} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedSpirits;