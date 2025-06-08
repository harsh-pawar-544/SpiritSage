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
  // Extract 'id' from the URL. Currently, this page assumes the 'id' belongs to a Brand.
  // If your routing allows for '/spirits/:type/:id', you would extract 'type' here too:
  // const { type, id } = useParams<{ type: 'alcohol_type' | 'subtype' | 'brand', id: string }>();
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
      if (!id) {
        setSpiritError('Spirit ID is missing.');
        setSpiritLoading(false);
        return;
      }

      setSpiritLoading(true);
      setSpiritError(null);
      setSpirit(null); // Clear previous spirit data

      try {
        // ASSUMPTION: This page is currently set up to fetch Brand details.
        // If you want this page to handle AlcoholType or Subtype details as well,
        // you'll need to pass the spiritType in the URL (e.g., /spirits/:type/:id)
        // and add logic here to call getAlcoholTypeById, getSubtypeById, or getBrandById based on that type.
        const fetchedBrand = await getBrandById(id);

        if (fetchedBrand) {
          setSpirit(fetchedBrand);
          // --- Track 'view' interaction here ---
          // Assuming 'brand' as the spiritType since getBrandById is used.
          // If you implement dynamic type fetching, use the actual spiritType.
          trackInteraction(fetchedBrand.id, 'brand', 'view'); // <-- Added this line
        } else {
          setSpiritError('Spirit not found or invalid ID.');
        }
      } catch (err: any) {
        console.error('Error fetching spirit:', err);
        setSpiritError(`Failed to load spirit: ${err.message || 'Unknown error'}`);
      } finally {
        setSpiritLoading(false);
      }
    };

    // Only fetch if context is not globally loading or has no error
    // and trigger a re-fetch if 'id' or context loading/error states change.
    // Also, include `trackInteraction` in dependencies to satisfy ESLint, though it's
    // memoized in RecommendationsContext, so it shouldn't cause unnecessary re-renders.
    if (!spiritsContextLoading && !spiritsContextError) {
      fetchSpiritData();
    }
  }, [id, getBrandById, spiritsContextLoading, spiritsContextError, trackInteraction]); // <-- Added trackInteraction to dependencies

  // --- Fetch Ratings for the Spirit ---
  useEffect(() => {
    const fetchRatings = async () => {
      if (spirit && spirit.id) { // Ensure spirit is loaded and has an ID
        try {
          const ratings = await getRatingsForBrand(spirit.id);
          setBrandRatings(ratings);
        } catch (err) {
          console.error('Error fetching ratings:', err);
          // Handle error, e.g., set an error state for ratings
        }
      }
    };
    fetchRatings();
  }, [spirit, getRatingsForBrand]); // Re-fetch ratings when spirit data changes or getRatingsForBrand changes

  // --- Handlers for Rating Form and Deletion ---

  // Find the current user's rating for this spirit, if it exists
  // Make sure `supabase` is imported if you're using `supabase.auth.user()` here.
  const userRating = brandRatings.find(r => r.user_id === supabase.auth.user()?.id);

  const handleEditRating = (rating: Rating) => {
    setEditingRating(rating);
    setShowRatingForm(true);
  };

  const handleDeleteRating = (ratingId: string) => {
    setRatingToDeleteId(ratingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (ratingToDeleteId && spirit) { // Ensure spirit is available for re-fetching ratings
      try {
        // You'll need to implement and import `deleteRating` from SpiritsContext
        // For now, it's a placeholder:
        // await deleteRating(ratingToDeleteId);
        console.log(`Simulating delete for rating ID: ${ratingToDeleteId}`);

        // After successful deletion (or simulation), re-fetch ratings to update the list
        const updatedRatings = await getRatingsForBrand(spirit.id);
        setBrandRatings(updatedRatings);
        setRatingToDeleteId(null);
        setShowDeleteModal(false);
      } catch (err) {
        console.error('Error deleting rating:', err);
        // Display error to user
      }
    }
  };

  const handleRatingSuccess = async () => {
    setShowRatingForm(false);
    setEditingRating(null);
    // After adding/editing, re-fetch ratings to update the list
    if (spirit && spirit.id) {
      const updatedRatings = await getRatingsForBrand(spirit.id);
      setBrandRatings(updatedRatings);
    }
  };

  // --- Render Logic for Loading/Error/Not Found ---
  if (spiritsContextLoading || spiritLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirit...</p>
        {/* Optional: Add a spinner here */}
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