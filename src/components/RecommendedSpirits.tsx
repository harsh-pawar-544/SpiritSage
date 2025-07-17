import React from 'react';
import { Info, X } from 'lucide-react';
import { useRecommendations } from '../contexts/RecommendationsContext';
import { Link } from 'react-router-dom';
import TransitionImage from './ui/TransitionImage';
import RatingStars from './RatingStars';

// Define the interface for recommended spirit items
export interface RecommendedSpiritItem {
  id: string;
  name: string;
  image_url: string;
  type: 'alcohol_type' | 'subtype' | 'brand';
}

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

  if (recommendedSpirits.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8 border border-dashed rounded-lg">
        <p className="mb-2">No recommendations yet.</p>
        <p className="text-sm">Interact with some spirits (view, rate, favorite) to get started!</p>
      </div>
    );
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
        {recommendedSpirits.map(spirit => (
          <Link
            key={spirit.id}
            to={`/${spirit.type === 'alcohol_type' ? 'alcohol-type' : spirit.type}/${spirit.id}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[4/3]">
              <TransitionImage
                src={spirit.image_url}
                alt={spirit.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-white mb-1 capitalize">{spirit.type.replace('_', ' ')}</div>
                <h3 className="text-xl font-bold text-white mb-2">{spirit.name}</h3>
                <div className="flex items-center space-x-2">
                  <RatingStars rating={4} size="sm" />
                  <span className="text-white text-sm">Recommended</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSpirits;