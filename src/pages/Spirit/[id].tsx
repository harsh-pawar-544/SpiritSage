// src/pages/Spirit/[id].tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
// import { getSpiritById, getSimilarSpirits } from '../../data/spiritCategories'; // Remove this import
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import RatingStars from '../../components/RatingStars';
import RatingForm from '../../components/SpiritRating/RatingForm';
import RatingsList from '../../components/SpiritRating/RatingsList';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types'; // Import Brand type

const SpiritProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBrandById, getRatingsForBrand, getTastingNotesForSpirit } = useSpirits(); // Use getBrandById
  const { trackInteraction } = useRecommendations();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState<any[]>([]);
  const [tastingNotes, setTastingNotes] = useState<Array<{ term: string; percentage: number }>>([]);
  const [spirit, setSpirit] = useState<Brand | null>(null); // State for the spirit

  // const spirit = id ? getSpiritById(id) : null; // Remove this line
  // const similarSpirits = getSimilarSpirits(id || '', 3); // Remove this line.  We'll address this later.
  const [similarSpirits, setSimilarSpirits] = useState<any[]>([]); // Initialize state for similar spirits
  const parentCategoryId = id?.split('-')[0];

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      trackInteraction(id, 'view');

      Promise.all([
        getBrandById(id), // Fetch spirit details using getBrandById
        getRatingsForBrand(id),
        getTastingNotesForSpirit(id)
      ])
        .then(([spiritData, ratingsData, tastingNotesData]) => {
          setSpirit(spiritData); // Set the spirit data
          setRatings(ratingsData);
          setTastingNotes(tastingNotesData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setSpirit(null); // Handle errors by setting spirit to null
          setRatings([]);
          setTastingNotes([]);
          setIsLoading(false);
        });
    }
  }, [id, getBrandById, getRatingsForBrand, getTastingNotesForSpirit, trackInteraction]); // Add getBrandById to dependencies

  if (!spirit) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {isLoading ? (
          <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirit...</p>
        ) : (
          <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit not found</p>
        )}
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

      {/* Rest of your component... using spirit.property instead of spirit.details.stats?.category etc. */}
    </div>
  );
};

export default SpiritProfilePage;