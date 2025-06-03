import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../contexts/SpiritsContext';
import type { Database } from '../lib/database.types';

type SpiritSubtype = Database['public']['Tables']['spirit_subtypes']['Row'];
type Rating = Database['public']['Tables']['ratings']['Row'];

const SpiritPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSubtypeById, getRatings } = useSpirits();
  const [spirit, setSpirit] = useState<SpiritSubtype | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpirit() {
      if (!id) return;
      
      try {
        setLoading(true);
        const [spiritData, ratingsData] = await Promise.all([
          getSubtypeById(id),
          getRatings(id)
        ]);
        
        setSpirit(spiritData);
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error loading spirit:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSpirit();
  }, [id, getSubtypeById, getRatings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!spirit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Spirit not found</h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={`/category/${spirit.category_id}`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Category
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64 sm:h-80">
          <img
            src={spirit.image}
            alt={spirit.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white">{spirit.name}</h1>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-lg leading-relaxed">
            {spirit.description}
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews ({ratings.length})
            </h2>
            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">
                          {'★'.repeat(rating.rating)}
                          {'☆'.repeat(5 - rating.rating)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{rating.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No reviews yet. Be the first to review this spirit!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritPage;