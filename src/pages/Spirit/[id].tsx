import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types'; // Make sure your Brand type includes 'image'

const SpiritProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBrandById, getTastingNotesForSpirit } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [isLoading, setIsLoading] = useState(true);
  const [tastingNotes, setTastingNotes] = useState<Array<{ term: string; percentage: number }>>([]);
  const [spirit, setSpirit] = useState<Brand | null>(null);
  // const [similarSpirits, setSimilarSpirits] = useState<any[]>([]); // This state is not used
  const parentCategoryId = id?.split('-')[0]; // Assuming your ID structure allows this

  useEffect(() => {
    // Only proceed if 'id' is defined
    if (id) {
      setIsLoading(true); // Start loading state

      Promise.all([
        getBrandById(id),
        getTastingNotesForSpirit(id)
      ])
        .then(([spiritData, tastingNotesData]) => {
          setSpirit(spiritData);
          setTastingNotes(tastingNotesData);
          setIsLoading(false); // End loading state
          // Track interaction ONLY after successful data load
          if (spiritData) {
            // Assuming 'brand' is the correct spiritType for this page's ID
            trackInteraction(id, 'brand', 'view');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setSpirit(null); // Clear spirit on error
          setTastingNotes([]); // Clear tasting notes on error
          setIsLoading(false); // End loading state
        });
    }
  }, [id, getBrandById, getTastingNotesForSpirit, trackInteraction]); // trackInteraction is now stable

  // --- Conditional Rendering based on Loading/Spirit existence ---
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirit details...</p>
      </div>
    );
  }

  if (!spirit) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit not found or an error occurred.</p>
        <Link
          to={`/category/${parentCategoryId || ''}`} // Fallback for parentCategoryId
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 ml-4 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Overview
        </Link>
      </div>
    );
  }

  // --- Main Content Rendering ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to={`/category/${parentCategoryId || ''}`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Overview
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Spirit Image Section */}
        <div className="flex justify-center md:justify-end">
          {/* Use TransitionImage with a fallback if spirit.image is undefined */}
          <TransitionImage
            src={spirit.image || 'https://via.placeholder.com/300x400?text=Spirit+Image'}
            alt={spirit.name}
            className="w-full max-w-xs md:max-w-md rounded-lg shadow-lg object-contain"
            // You might want to add width/height props for better layout
            width={300}
            height={400}
          />
        </div>

        {/* Spirit Details Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {spirit.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
            {spirit.description}
          </p>

          {spirit.abv && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">ABV:</span> {spirit.abv}%
            </p>
          )}

          {/* Display Tasting Notes */}
          {tastingNotes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Tasting Notes</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {tastingNotes.map((note, index) => (
                  <li key={index}>{note.term} ({note.percentage.toFixed(0)}%)</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add more details here as needed, e.g., price range, origin, etc. */}
        </div>
      </div>
    </div>
  );
};

export default SpiritProfilePage;