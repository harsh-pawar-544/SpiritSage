import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpirits } from '../contexts/SpiritsContext';
import RatingStars from './RatingStars';
import TransitionImage from './ui/TransitionImage';
import { type SpiritSubtype } from '../data/types';

interface RecommendedSpiritCardProps {
  spirit: SpiritSubtype;
}

const RecommendedSpiritCard: React.FC<RecommendedSpiritCardProps> = ({ spirit }) => {
  const { getRatingsForBrand } = useSpirits();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const spiritRatings = await getRatingsForBrand(spirit.id);
        setRatings(spiritRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
        setRatings([]);
      }
    };
    
    fetchRatings();
  }, [spirit.id, getRatingsForBrand]);

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <Link
      to={`/spirit/${spirit.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/3]">
        <TransitionImage
          src={spirit.image}
          alt={spirit.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white mb-1">{spirit.details?.stats?.category}</div>
          <h3 className="text-xl font-bold text-white mb-2">{spirit.name}</h3>
          <div className="flex items-center space-x-2">
            <RatingStars rating={Math.round(avgRating)} size="sm" />
            <span className="text-white text-sm">
              ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedSpiritCard;