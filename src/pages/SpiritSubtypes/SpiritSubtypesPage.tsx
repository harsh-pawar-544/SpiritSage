// src/pages/SpiritSubtypes/SpiritSubtypesPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import RatingStars from '../../components/RatingStars'; // Make sure this path is correct if not using this component
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritSubtypesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // --- CHANGE MADE HERE ---
  // Renamed getSubtypesByCategory to getSubtypesByCategoryId
  const { getSubtypesByCategoryId, getRatingsForBrand } = useSpirits(); // Changed getRatingsForSpirit to getRatingsForBrand (as per SpiritsContext)
  const [subtypes, setSubtypes] = useState<any[]>([]); // 'any[]' can be replaced with Subtype[] for better type safety
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubtypes = async () => {
      if (!id) return;

      try {
        // --- CHANGE MADE HERE ---
        // Called getSubtypesByCategoryId
        const data = await getSubtypesByCategoryId(id);
        setSubtypes(data);
      } catch (error) {
        console.error('Error fetching subtypes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtypes();
  }, [id, getSubtypesByCategoryId]); // Dependency array also updated

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // NOTE: You are checking if !subtypes.length, but it seems like 'category_name'
  // is expected on subtypes[0]. If no subtypes are found, this might cause an error
  // or display 'Spirit' only.
  if (!subtypes.length) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">No subtypes found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to={`/category/${id}`}
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Overview
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Types of {subtypes[0]?.category_name || 'Spirit'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtypes.map(subtype => (
          <div
            key={subtype.id}
            className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
            // The onClick navigate path is /spirit/${subtype.id}. This assumes subtype.id is a brand ID,
            // but usually /spirit/:id routes to an individual brand profile.
            // If you intend to show a list of brands here, the path should be different
            // e.g., `/subtype/${subtype.id}/brands`
            onClick={() => navigate(`/spirit/${subtype.id}`)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/spirit/${subtype.id}`);
              }
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
                <TransitionImage
                  src={subtype.image}
                  alt={subtype.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{subtype.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <RatingStars rating={Math.round(subtype.average_rating || 0)} size="sm" />
                    <span className="text-white text-sm">
                      ({subtype.rating_count || 0} {subtype.rating_count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 line-clamp-2">{subtype.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpiritSubtypesPage;