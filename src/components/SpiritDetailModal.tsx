import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, X, ChevronRight, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useSpirits } from '../contexts/SpiritsContext';
import RatingStars from './RatingStars';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom'; // <--- IMPORTANT: Import Link

interface SpiritDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  spirit: {
    id: string;
    name: string;
    description: string;
    imageSrc: string; // This seems to be a display-ready URL
    flavorProfile: string[];
    history: string;
    // --- ADDED THESE NEW PROPERTIES ---
    subtype_id?: string; // The ID of the spirit's direct subtype
    subtype_name?: string; // The name of the spirit's direct subtype (e.g., "Scotch Whisky")
    alcohol_type_id?: string; // The ID of the parent alcohol type (category)
    alcohol_type_name?: string; // The name of the parent alcohol type (e.g., "Whisky")
    // --- END ADDED PROPERTIES ---
  };
}

const SpiritDetailModal: React.FC<SpiritDetailModalProps> = ({
  isOpen,
  onClose,
  spirit
}) => {
  const { getRatingsForSpirit, getTastingNotesForSpirit, addRating } = useSpirits();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  const ratings = getRatingsForSpirit(spirit.id);
  const tastingNotes = getTastingNotesForSpirit(spirit.id);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await addRating(spirit.id, rating, review);
      setRating(0);
      setReview('');
      setActiveTab('reviews');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = tastingNotes
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 8)
    .map(note => ({
      name: note.term,
      value: note.percentage
    }));

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[95vw] max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="relative h-72">
            <img
              src={spirit.imageSrc}
              alt={spirit.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center text-white space-x-2 mb-2">
                {/* Condition for the Alcohol Type (Category) link */}
                {spirit.alcohol_type_id && spirit.alcohol_type_name && (
                  <>
                    <Link
                      to={`/alcohol-type/${spirit.alcohol_type_id}`}
                      className="text-sm font-medium hover:underline"
                      onClick={onClose} // Close modal when navigating
                    >
                      {spirit.alcohol_type_name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {/* Condition for the Subtype link */}
                {spirit.subtype_id && spirit.subtype_name && (
                  <>
                    <Link
                      to={`/subtype/${spirit.subtype_id}`}
                      className="text-sm font-medium hover:underline"
                      onClick={onClose} // Close modal when navigating
                    >
                      {spirit.subtype_name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {/* The current spirit's name */}
                <span className="text-lg font-semibold">{spirit.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RatingStars rating={Math.round(averageRating)} size="lg" />
                  <span className="text-white text-xl font-medium">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">
                  ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          <div className="border-b dark:border-gray-800">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'overview'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Overview
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === 'reviews'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Reviews
                {activeTab === 'reviews' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-28rem)]">
            {activeTab === 'overview' ? (
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-gray-600 dark:text-gray-300">{spirit.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Tasting Profile</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#6366f1"
                            radius={[0, 4, 4, 0]}
                            label={{ position: 'right', fill: '#6366f1' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">History</h3>
                  <p className="text-gray-600 dark:text-gray-300">{spirit.history}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Rating
                      </label>
                      <RatingStars
                        rating={rating}
                        onChange={setRating}
                        size="lg"
                        interactive={true}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800"
                        rows={4}
                        placeholder="Share your thoughts about this spirit..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={rating === 0 || isSubmitting}
                      className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
                        rating === 0 || isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {ratings.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}

                  {ratings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors">
            <X className="w-5 h-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SpiritDetailModal;