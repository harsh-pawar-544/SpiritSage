import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext'; // <-- Import useRecommendations
import RatingForm from '../../components/SpiritRating/RatingForm';
import RatingsList from '../../components/SpiritRating/RatingsList';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Brand, Rating } from '../../data/types';
import { supabase } from '../../lib/supabaseClient'; // <-- Assuming this path for Supabase client

const SpiritDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading: spiritsContextLoading,
    error: spiritsContextError,
    getBrandById,
    addRating,
    getRatingsForBrand,
    // Add deleteRating and updateRating here once implemented in SpiritsContext:
    // deleteRating,
    // updateRating,
  } = useSpirits();

  // Get the trackInteraction function from your RecommendationsContext
  const { trackInteraction } = useRecommendations(); // <-- Destructure trackInteraction

  const [spirit, setSpirit] = useState<Brand | null>(null);
  const [spiritLoading, setSpiritLoading] = useState<boolean>(true);
  const [spiritError, setSpiritError] = useState<string | null>(null);
  const [brandRatings, setBrandRatings] = useState<Rating[]>([]);

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<Rating | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ratingToDeleteId, setRatingToDeleteId] = useState<string | null>(null);


  // --- Fetch Spirit Data (Brand) ---
  useEffect(() => {
    const fetchSpiritData = async () => {
      // --- START NEW DEBUG LOGS HERE ---
      console.log("SpiritDetailPage: fetchSpiritData started.");
      console.log("SpiritDetailPage: Current URL ID parameter:", id);
      // --- END NEW DEBUG LOGS HERE ---

      if (!id) {
        setSpiritError('Spirit ID is missing.');
        setSpiritLoading(false);
        console.log("SpiritDetailPage: Spirit ID is missing."); // Debug log
        return;
      }

      setSpiritLoading(true);
      setSpiritError(null);
      setSpirit(null); // Clear previous spirit data

      try {
        const fetchedBrand = await getBrandById(id);

        if (fetchedBrand) {
          setSpirit(fetchedBrand);
          // --- Debug Logs: Verify trackInteraction is called ---
          console.log("SpiritDetailPage: Spirit fetched successfully:", fetchedBrand.name, "ID:", fetchedBrand.id); // NEW LOG
          console.log("SpiritDetailPage: Spirit fetched, attempting to track interaction.");
          console.log("SpiritDetailPage: Spirit ID for tracking:", fetchedBrand.id, "Spirit Type:", 'brand');
          console.log("SpiritDetailPage: ABOUT TO CALL trackInteraction!");
          // --- Track 'view' interaction here ---
          trackInteraction(fetchedBrand.id, 'brand', 'view'); // <-- This is the important line
        } else {
          setSpiritError('Spirit not found or invalid ID.');
          console.log("SpiritDetailPage: Spirit not found for ID:", id); // Debug log if not found
        }
      } catch (err: any) {
        console.error('SpiritDetailPage: Error fetching spirit:', err); // Debug error log
        setSpiritError(`Failed to load spirit: ${err.message || 'Unknown error'}`);
      } finally {
        setSpiritLoading(false);
        console.log("SpiritDetailPage: fetchSpiritData completed. SpiritLoading set to false."); // NEW LOG
      }
    };

    // Only fetch if context is not globally loading or has no error
    if (!spiritsContextLoading && !spiritsContextError) {
      console.log("SpiritDetailPage: SpiritsContext ready, initiating spirit data fetch."); // Debug log
      fetchSpiritData();
    } else {
      console.log("SpiritDetailPage: Deferring spirit data fetch due to SpiritsContext loading or error.", { spiritsContextLoading, spiritsContextError }); // Debug log
    }
  }, [id, getBrandById, spiritsContextLoading, spiritsContextError, trackInteraction]);


  // --- Fetch Ratings for the Spirit ---
  useEffect(() => {
    const fetchRatings = async () => {
      if (spirit && spirit.id) { // Ensure spirit is loaded and has an ID
        console.log("SpiritDetailPage: Fetching ratings for spirit ID:", spirit.id); // Debug log
        try {
          const ratings = await getRatingsForBrand(spirit.id);
          setBrandRatings(ratings);
          console.log("SpiritDetailPage: Ratings fetched successfully. Count:", ratings.length); // Debug log
        } catch (err) {
          console.error('SpiritDetailPage: Error fetching ratings:', err); // Debug error log
          // Handle error, e.g., set an error state for ratings
        }
      } else {
        console.log("SpiritDetailPage: Not fetching ratings, spirit or spirit ID is missing."); // Debug log
      }
    };
    fetchRatings();
  }, [spirit, getRatingsForBrand]);


  // --- Handlers for Rating Form and Deletion ---
  const userRating = brandRatings.find(r => r.user_id === supabase.auth.user()?.id);

  const handleEditRating = (rating: Rating) => {
    setEditingRating(rating);
    setShowRatingForm(true);
    console.log("SpiritDetailPage: Editing rating for ID:", rating.id); // Debug log
  };

  const handleDeleteRating = (ratingId: string) => {
    setRatingToDeleteId(ratingId);
    setShowDeleteModal(true);
    console.log("SpiritDetailPage: Preparing to delete rating ID:", ratingId); // Debug log
  };

  const confirmDelete = async () => {
    if (ratingToDeleteId && spirit) {
      console.log("SpiritDetailPage: Confirming delete for rating ID:", ratingToDeleteId); // Debug log
      try {
        // You'll need to implement and import `deleteRating` from SpiritsContext
        // For now, it's a placeholder:
        // await deleteRating(ratingToDeleteId);
        console.log(`SpiritDetailPage: Simulating delete for rating ID: ${ratingToDeleteId}`);

        // After successful deletion (or simulation), re-fetch ratings to update the list
        const updatedRatings = await getRatingsForBrand(spirit.id);
        setBrandRatings(updatedRatings);
        setRatingToDeleteId(null);
        setShowDeleteModal(false);
        console.log("SpiritDetailPage: Rating deleted (simulated) and ratings re-fetched."); // Debug log
      } catch (err) {
        console.error('SpiritDetailPage: Error deleting rating:', err); // Debug error log
      }
    }
  };

  const handleRatingSuccess = async () => {
    setShowRatingForm(false);
    setEditingRating(null);
    console.log("SpiritDetailPage: Rating submission successful, re-fetching ratings."); // Debug log
    if (spirit && spirit.id) {
      const updatedRatings = await getRatingsForBrand(spirit.id);
      setBrandRatings(updatedRatings);
      // After successfully submitting/updating a rating, also track this interaction
      // trackInteraction(spirit.id, 'brand', 'rate', { rating: userRating?.rating }); // You might want to pass the actual new rating here
    }
  };

  // --- Render Logic for Loading/Error/Not Found ---
  if (spiritsContextLoading || spiritLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirit...</p>
      </div>
    );
  }

  if (spiritsContextError || spiritError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-red-600 dark:text-red-400 mb-4">Error: {spiritsContextError || spiritError}</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  // If spirit is null after loading, it means it wasn't found
  if (!spirit) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">Spirit not found</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  // --- Main Render (Spirit Details) ---
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Link
        to="/explore"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Explore
      </Link>

      <div className="relative">
        <div className="h-[400px] w-full overflow-hidden rounded-xl">
          <img
            src={spirit.image || 'https://via.placeholder.com/600x400.png?text=No+Image'}
            alt={spirit.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
        <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white">
          {spirit.name}
        </h1>
      </div>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Details
          </h2>
          {spirit.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {spirit.description}
            </p>
          )}
          <ul className="text-lg text-gray-700 dark:text-gray-300 space-y-2">
            {spirit.abv && <li><span className="font-medium">ABV:</span> {spirit.abv}%</li>}
            {spirit.origin && <li><span className="font-medium">Origin:</span> {spirit.origin}</li>}
            {spirit.price_range && <li><span className="font-medium">Price Range:</span> {spirit.price_range}</li>}
            {spirit.producer && <li><span className="font-medium">Producer:</span> {spirit.producer}</li>}
          </ul>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ratings & Reviews
            </h2>
            {!showRatingForm && !userRating && (
              <button
                onClick={() => setShowRatingForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>

          {showRatingForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingRating ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              <RatingForm
                spiritId={id}
                onSuccess={handleRatingSuccess}
                initialRating={editingRating?.rating}
                initialComment={editingRating?.comment}
                ratingId={editingRating?.id}
                onSubmit={addRating}
                onCancel={() => {
                  setShowRatingForm(false);
                  setEditingRating(null);
                }}
              />
            </div>
          )}

          <RatingsList
            ratings={brandRatings}
            onEdit={handleEditRating}
            onDelete={handleDeleteRating}
          />
        </section>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
      />
    </div>
  );
};

export default SpiritDetailPage;