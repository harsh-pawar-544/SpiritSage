// src/components/SpiritDetailModalContent.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabaseClient'; // Import Supabase client
import { useSpirits } from '../../contexts/SpiritsContext'; // Assuming getRatings comes from here
import RatingStars from './RatingStars';
import RatingForm from './SpiritRating/RatingForm';
import { DialogTitle } from './ui/dialog';
import { Loader2 } from 'lucide-react'; // For loading state

interface SpiritDetailModalContentProps {
  spiritId: string;
}

// Define interface for Spirit data fetched from Supabase
interface SpiritFromSupabase {
  id: string;
  name: string;
  description: string;
  image_url: string; // Assuming your Supabase column is named 'image_url'
  type?: string; // Add if you have a 'type' column or can derive it
  region?: string; // Add if you have a 'region' column
  flavor_profile?: string[]; // Assuming this is an array of strings in Supabase
  history?: string; // Add if you have a 'history' column
  // Add other properties as they exist in your 'spirits' table in Supabase
}

const SpiritDetailModalContent: React.FC<SpiritDetailModalContentProps> = ({ spiritId }) => {
  const [spirit, setSpirit] = useState<SpiritFromSupabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getRatings } = useSpirits(); // Get ratings function from context

  useEffect(() => {
    const fetchSpiritDetails = async () => {
      if (!spiritId) {
        setError('No spirit ID provided.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('spirits') // Assuming your table for individual spirits/brands is named 'spirits'
          .select('*') // Select all columns for the spirit details
          .eq('id', spiritId)
          .single();

        if (fetchError) {
          console.error('Error fetching spirit details:', fetchError);
          throw new Error('Failed to load spirit details.');
        }

        if (!data) {
          setError('Spirit not found.');
        } else {
          setSpirit(data as SpiritFromSupabase); // Cast data to your interface
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpiritDetails();
  }, [spiritId]);

  const ratings = getRatings(spiritId); // Get ratings from context

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading spirit details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!spirit) {
    return <div className="text-gray-600 dark:text-gray-400 text-center p-8">Spirit not found</div>;
  }

  // Calculate average rating if needed, though getRatings might handle it
  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      <div className="relative h-64 -mx-6 -mt-6 mb-6">
        <img
          src={spirit.image_url} // Use image_url from Supabase data
          alt={spirit.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <DialogTitle className="text-2xl font-bold text-white mb-2">{spirit.name}</DialogTitle>
          <div className="flex items-center space-x-2 text-white">
            {spirit.type && <span>{spirit.type}</span>}
            {spirit.type && spirit.region && <span>•</span>}
            {spirit.region && <span>{spirit.region}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RatingStars rating={Math.round(avgRating)} size="lg" />
          <span className="text-lg font-medium">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{spirit.description}</p>
        </div>

        {spirit.flavor_profile && spirit.flavor_profile.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Flavor Profile</h3>
            <div className="flex flex-wrap gap-2">
              {spirit.flavor_profile.map((flavor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}

        {spirit.history && (
          <div>
            <h3 className="text-lg font-semibold mb-2">History</h3>
            <p className="text-gray-600 dark:text-gray-300">{spirit.history}</p>
          </div>
        )}
      </div>

      <div className="border-t dark:border-gray-800 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>

        <div className="space-y-6">
          <RatingForm
            spiritId={spiritId}
            onSuccess={() => {
              // Handle success, e.g., re-fetch ratings or update state
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