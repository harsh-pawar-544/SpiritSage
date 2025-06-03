import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { getSpiritById, getSimilarSpirits } from '../../data/spiritCategories';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import RatingStars from '../../components/RatingStars';
import RatingForm from '../../components/SpiritRating/RatingForm';
import RatingsList from '../../components/SpiritRating/RatingsList';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRatingsForSpirit, getTastingNotesForSpirit } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const spirit = id ? getSpiritById(id) : null;
  const ratings = getRatingsForSpirit(id || '');
  const tastingNotes = getTastingNotesForSpirit(id || '');
  const similarSpirits = getSimilarSpirits(id || '', 3);
  
  // Get the parent category ID from the spirit ID (e.g., 'gin' from 'london-dry')
  const parentCategoryId = id?.split('-')[0];
  
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      trackInteraction(id, 'view');
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [id]);

  if (!spirit) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit not found</p>
      </div>
    );
  }

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`}>
      <Link 
        to={`/category/${parentCategoryId}`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Overview
      </Link>

      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <TransitionImage
          src={spirit.image}
          alt={spirit.name}
          className="w-full h-full object-cover"
          wrapperClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="text-white mb-2">{spirit.details.stats?.category}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{spirit.name}</h1>
          <div className="flex items-center space-x-4">
            <RatingStars rating={Math.round(avgRating)} size="lg" />
            <span className="text-white text-xl">
              {avgRating.toFixed(1)}
              <span className="text-gray-300 text-base ml-2">
                ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">About this Spirit</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {spirit.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Characteristics</h2>
            <div className="flex flex-wrap gap-2">
              {spirit.details.characteristics.map((char, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                >
                  {char}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Production Method</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {spirit.details.productionMethod}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">History</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {spirit.details.history}
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              {!showRatingForm && (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showRatingForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
                <RatingForm
                  spiritId={spirit.id}
                  onSuccess={() => setShowRatingForm(false)}
                />
              </div>
            )}

            <RatingsList ratings={ratings} />
          </section>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Spirit Details</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="text-gray-900 dark:text-white">{spirit.details.stats?.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Origin</dt>
                <dd className="text-gray-900 dark:text-white">{spirit.details.stats?.origin}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">ABV</dt>
                <dd className="text-gray-900 dark:text-white">{spirit.details.stats?.abv}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Rating</dt>
                <dd className="flex items-center space-x-2">
                  <RatingStars rating={Math.round(avgRating)} size="sm" />
                  <span className="text-gray-900 dark:text-white">
                    {avgRating.toFixed(1)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {similarSpirits.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">You Might Also Like</h3>
              <div className="space-y-4">
                {similarSpirits.map(similar => (
                  <Link
                    key={similar.id}
                    to={`/spirit/${similar.id}`}
                    className="flex items-center space-x-4 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <TransitionImage
                        src={similar.image}
                        alt={similar.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {similar.name}
                      </h4>
                      <p className="text-sm text-gray-500">{similar.details.stats?.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tastingNotes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Common Tasting Notes</h3>
              <div className="space-y-2">
                {tastingNotes.slice(0, 5).map(note => (
                  <div
                    key={note.term}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {note.term}
                    </span>
                    <span className="text-gray-500">
                      {note.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpiritProfilePage;