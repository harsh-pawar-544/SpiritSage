import React, { useState } from 'react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import RatingStars from '../RatingStars';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface RatingFormProps {
  spiritId: string;
  onSuccess?: () => void;
  initialRating?: number;
  initialComment?: string;
  ratingId?: string;
}

const MAX_COMMENT_LENGTH = 300;

const RatingForm: React.FC<RatingFormProps> = ({
  spiritId,
  onSuccess,
  initialRating = 0,
  initialComment = '',
  ratingId
}) => {
  const { addRating, updateRating } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (comment.length > MAX_COMMENT_LENGTH) {
      toast.error('Comment is too long');
      return;
    }

    setIsSubmitting(true);

    try {
      if (ratingId) {
        await updateRating(ratingId, rating, comment);
        toast.success('Rating updated successfully!');
      } else {
        await addRating(spiritId, rating, comment);
        trackInteraction(spiritId, 'rate', { rating, comment });
        toast.success('Rating submitted successfully!');
      }

      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Rating
        </label>
        <div className="flex items-center space-x-4">
          <RatingStars
            rating={rating}
            onChange={setRating}
            disabled={isSubmitting}
            size="lg"
            interactive={true}
          />
          {rating > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {rating} {rating === 1 ? 'star' : 'stars'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Review
          </label>
          <span className={`text-sm ${
            comment.length > MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500'
          }`}>
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
          placeholder="Share your thoughts about this spirit..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || comment.length > MAX_COMMENT_LENGTH}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting || rating === 0 || comment.length > MAX_COMMENT_LENGTH
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : (
          <span>{ratingId ? 'Update Rating' : 'Submit Rating'}</span>
        )}
      </button>
    </form>
  );
};

export default RatingForm;