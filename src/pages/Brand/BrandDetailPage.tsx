import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import RatingStars from '../../components/RatingStars';
import RatingForm from '../../components/SpiritRating/RatingForm';
import RatingsList from '../../components/SpiritRating/RatingsList';
import TransitionImage from '../../components/ui/TransitionImage';

const BrandDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRatingsForSpirit, getTastingNotesForSpirit } = useSpirits();
  const [showRatingForm, setShowRatingForm] = React.useState(false);

  // TODO: Replace with Supabase query
  const brand = {
    id: '1',
    name: 'Sample Brand',
    description: 'A premium spirit with rich history.',
    image: 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg',
    details: {
      region: 'Scotland',
      abv: '40%',
      category: 'Single Malt Whisky',
      tastingNotes: 'Rich and complex with notes of vanilla, oak, and subtle spices.',
      productionMethod: 'Traditional copper pot still distillation.',
      history: 'Crafted using time-honored techniques passed down through generations.'
    }
  };

  if (!brand) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Brand not found</p>
      </div>
    );
  }

  const ratings = getRatingsForSpirit(id || '');
  const tastingNotes = getTastingNotesForSpirit(id || '');
  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/spirits"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Spirits
      </Link>

      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <TransitionImage
          src={brand.image}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="text-white mb-2">{brand.details.category}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{brand.name}</h1>
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
              {brand.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tasting Notes</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {brand.details.tastingNotes}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Production Method</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {brand.details.productionMethod}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">History</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {brand.details.history}
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
                  spiritId={brand.id}
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
                <dd className="text-gray-900 dark:text-white">{brand.details.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Region</dt>
                <dd className="text-gray-900 dark:text-white">{brand.details.region}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">ABV</dt>
                <dd className="text-gray-900 dark:text-white">{brand.details.abv}</dd>
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

export default BrandDetailPage;