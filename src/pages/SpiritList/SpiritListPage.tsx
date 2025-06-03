// src/pages/Spirit/SpiritDetailPage.tsx -> Suggested New Name: src/pages/SpiritsBySubtype/SpiritsBySubtypePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react'; // Added Loader2
import { useSpirits, SpiritRating } from '../../contexts/SpiritsContext';
import RatingForm from '../../components/SpiritRating/RatingForm'; // Keep if you want per-spirit ratings
import RatingsList from '../../components/SpiritRating/RatingsList'; // Keep if you want per-spirit ratings
import ConfirmationModal from '../../components/ConfirmationModal'; // Keep if you want per-spirit ratings
import TransitionImage from '../../components/ui/TransitionImage'; // Added TransitionImage
import { supabase } from '../../lib/supabaseClient'; // Import Supabase client

// Define types for the data we'll fetch
interface Subtype {
  id: string;
  name: string;
  description: string;
  image: string; // Assuming subtypes have an image
  alcohol_type_id: string; // To navigate back to parent category
}

interface SpiritBrand {
  id: string;
  name: string;
  description: string;
  image_url: string; // Assuming individual spirit brands have an image
  subtype_id: string; // Foreign key to subtypes
  // Add other properties relevant to a single spirit brand (e.g., ABV, distillery, tasting notes)
  tasting_notes?: string;
  history?: string;
  fun_facts?: string;
}

const SpiritsBySubtypePage: React.FC = () => { // Renamed component
  const { id } = useParams<{ id: string }>(); // 'id' here is the SUBTYPE_ID
  const navigate = useNavigate();
  const { getRatingsForSpirit, getUserRatingForSpirit, deleteRating } = useSpirits(); // Keep ratings logic if applicable to brands

  const [subtype, setSubtype] = useState<Subtype | null>(null);
  const [spirits, setSpirits] = useState<SpiritBrand[]>([]); // List of spirits/brands for this subtype
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for rating form (if rating individual spirits)
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [editingRating, setEditingRating] = useState<SpiritRating | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ratingToDelete, setRatingToDelete] = useState<string | null>(null);
  const [selectedSpiritForRating, setSelectedSpiritForRating] = useState<SpiritBrand | null>(null); // To track which spirit is being rated

  useEffect(() => {
    const fetchSubtypeAndSpirits = async () => {
      if (!id) {
        setIsLoading(false);
        setError('No subtype ID provided in URL.');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch the subtype details
        const { data: subtypeData, error: subtypeError } = await supabase
          .from('subtypes')
          .select('*') // Select all columns to get alcohol_type_id
          .eq('id', id)
          .single();

        if (subtypeError) {
          console.error('Error fetching subtype:', subtypeError);
          throw new Error('Could not find this spirit subtype.');
        }

        if (!subtypeData) {
          console.error('No subtype data found for ID:', id);
          throw new Error('Spirit subtype not found.');
        }

        setSubtype(subtypeData);

        // 2. Fetch all spirits (brands) associated with this subtype
        //    IMPORTANT: You need a 'spirits' or 'brands' table in Supabase
        //    that has a 'subtype_id' foreign key linking it to the 'subtypes' table.
        const { data: spiritsData, error: spiritsError } = await supabase
          .from('spirits') // Assuming your table for individual spirits/brands is named 'spirits'
          .select('*')
          .eq('subtype_id', subtypeData.id);

        if (spiritsError) {
          console.error('Error fetching spirits for subtype:', spiritsError);
          throw new Error('Could not load spirits for this subtype.');
        }

        setSpirits(spiritsData || []);

      } catch (err) {
        console.error('Error in fetchSubtypeAndSpirits:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        setSubtype(null);
        setSpirits([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtypeAndSpirits();
  }, [id]); // Re-run effect if the subtype ID in the URL changes


  // Handlers for rating specific spirits (if you keep this functionality)
  const handleEditRating = (rating: SpiritRating) => {
    // You'll need to ensure the RatingForm knows which spirit it's for
    setEditingRating(rating);
    setShowRatingForm(true);
  };

  const handleDeleteRating = (ratingId: string) => {
    setRatingToDelete(ratingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ratingToDelete) {
      deleteRating(ratingToDelete); // Assuming deleteRating can work with specific spirit IDs
      setRatingToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleWriteReview = (spiritBrand: SpiritBrand) => {
    setSelectedSpiritForRating(spiritBrand);
    setEditingRating(getUserRatingForSpirit(spiritBrand.id)); // Pre-fill if user already rated this specific spirit
    setShowRatingForm(true);
  };


  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="ml-2 text-lg text-gray-600 dark:text-gray-400 mt-4">Loading spirits...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">Go back to All Categories</Link>
      </div>
    );
  }

  // If not loading and no error, but subtype is null (e.g., ID not found)
  if (!subtype) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit subtype not found.</p>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">Go back to All Categories</Link>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Link - Now intelligently goes back to the parent category */}
      <Link
        to={`/category/${subtype.alcohol_type_id}`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to {subtype.name.split(' ')[0]} Types {/* e.g., "Back to Scotch Types" */}
      </Link>

      <div className="relative">
        <div className="h-[400px] w-full overflow-hidden rounded-xl">
          <TransitionImage // Using TransitionImage component
            src={subtype.image}
            alt={subtype.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
        <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white">
          {subtype.name} Spirits {/* e.g., "Scotch Single Malt Spirits" */}
        </h1>
      </div>

      <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {subtype.description}
      </p>

      {spirits.length === 0 && (
        <div className="text-center mt-12 p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            No specific spirit brands found for {subtype.name} yet.
          </p>
        </div>
      )}

      {spirits.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Explore {subtype.name} Brands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spirits.map(spiritBrand => {
              const ratings = getRatingsForSpirit(spiritBrand.id);
              const avgRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0;

              return (
                <div
                  key={spiritBrand.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                  // Link to a hypothetical *single brand detail page* if you create one later
                  // For now, we'll just show the cards, or you can link to an actual single detail page.
                  onClick={() => navigate(`/brand/${spiritBrand.id}`)} // Placeholder for navigating to a single brand's detail page
                >
                  <div className="relative aspect-[4/3]">
                    <TransitionImage
                      src={spiritBrand.image_url}
                      alt={spiritBrand.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">{spiritBrand.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <RatingStars rating={Math.round(avgRating)} size="sm" /> {/* Assuming RatingStars is imported */}
                        <span className="text-white text-sm">
                          ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-2">{spiritBrand.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* The Rating/Review Section - Now applies to the *subtype* if you want reviews for the overall subtype,
          or you'd move this section to a specific /brand/:id page */}
      {/* For now, I'm removing the RatingForm and RatingsList here to simplify,
          as they're likely for *individual brands* which would be on a separate page.
          You can re-integrate them if you decide to list all reviews for the subtype here.
          If you DO re-integrate, ensure you pass the correct spiritId (i.e., the brand's id)
          to RatingForm and RatingsList when they are mapped for each individual spirit. */}
      {/* For simplicity, let's assume the rating/review section moves to the *individual brand detail page*. */}

      {/* Keeping ConfirmationModal if you use it elsewhere, or remove if not needed */}
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

export default SpiritsBySubtypePage; // Export with new name