import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { SpiritRating } from '../../contexts/SpiritsContext';
import RatingStars from '../RatingStars';

interface RatingsListProps {
  ratings: SpiritRating[];
  onEdit?: (rating: SpiritRating) => void;
  onDelete?: (ratingId: string) => void;
  currentUserId?: string;
}

const RatingsList: React.FC<RatingsListProps> = ({
  ratings,
  onEdit,
  onDelete,
  currentUserId = 'current-user'
}) => {
  if (ratings.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
        No ratings yet. Be the first to rate this spirit!
      </p>
    );
  }

  const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <RatingStars rating={Math.round(averageRating)} size="md" />
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="space-y-4">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <RatingStars rating={rating.rating} size="sm" />
              <div className="flex items-center space-x-2">
                {rating.userId === currentUserId && (
                  <>
                    <button
                      onClick={() => onEdit?.(rating)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(rating.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">{rating.comment}</p>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
              {rating.updatedAt !== rating.createdAt && ' (edited)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsList;