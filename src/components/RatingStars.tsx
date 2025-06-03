import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onChange,
  disabled = false,
  size = 'md',
  interactive = false
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (value: number) => {
    if (!disabled && interactive && onChange) {
      onChange(value === rating ? 0 : value);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(star)}
          disabled={disabled || !interactive}
          className={`p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full ${
            interactive && !disabled ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          }`}
          type="button"
        >
          <Star
            className={`${sizes[size]} transition-colors ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;