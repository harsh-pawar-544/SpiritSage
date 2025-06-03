import React from 'react';
import { format } from 'date-fns';
import { mockSpirits } from '../data/mockSpirits';
import { getRatingsForSpirit } from '../data/mockRatingsAndComments';
import RatingStars from './RatingStars';
import RatingForm from './SpiritRating/RatingForm';
import { DialogTitle } from './ui/dialog';

interface SpiritDetailModalContentProps {
  spiritId: string;
}

const SpiritDetailModalContent: React.FC<SpiritDetailModalContentProps> = ({ spiritId }) => {
  const spirit = mockSpirits.find(s => s.id === spiritId);
  const ratings = getRatingsForSpirit(spiritId);

  if (!spirit) {
    return <div>Spirit not found</div>;
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      <div className="relative h-64 -mx-6 -mt-6 mb-6">
        <img
          src={spirit.imageSrc}
          alt={spirit.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <DialogTitle className="text-2xl font-bold text-white mb-2">{spirit.name}</DialogTitle>
          <div className="flex items-center space-x-2 text-white">
            <span>{spirit.type}</span>
            <span>•</span>
            <span>{spirit.region}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RatingStars rating={Math.round(spirit.avgRating)} size="lg" />
          <span className="text-lg font-medium">{spirit.avgRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{spirit.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Flavor Profile</h3>
          <div className="flex flex-wrap gap-2">
            {spirit.flavorProfile.map((flavor, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <p className="text-gray-600 dark:text-gray-300">{spirit.history}</p>
        </div>
      </div>

      <div className="border-t dark:border-gray-800 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        
        <div className="space-y-6">
          <RatingForm
            spiritId={spiritId}
            onSuccess={() => {
              // Handle success
            }}
          />

          {ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <RatingStars rating={rating.rating} size="sm" />
                      <span className="font-medium">{rating.userName}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(rating.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{rating.comment}</p>
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
  );
};

export default SpiritDetailModalContent;