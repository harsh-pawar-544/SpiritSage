import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types'; // Make sure your Brand type includes 'image_url' and other fields

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
    if (id) {
      setIsLoading(true);

      Promise.all([
        getBrandById(id),
        getTastingNotesForSpirit(id) // This likely fetches based on 'tasting_notes' column
      ])
        .then(([spiritData, tastingNotesData]) => {
          setSpirit(spiritData);
          // Ensure tastingNotesData is an array, map if necessary
          // Assuming tastingNotesData is already formatted correctly as { term: string; percentage: number }[]
          setTastingNotes(tastingNotesData || []); // Provide empty array if null
          setIsLoading(false);

          if (spiritData) {
            // Track interaction ONLY after successful data load
            // Assuming 'brand' is the correct spiritType for this page's ID
            trackInteraction(id, 'brand', 'view');
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setSpirit(null);
          setTastingNotes([]);
          setIsLoading(false);
        });
    }
  }, [id, getBrandById, getTastingNotesForSpirit, trackInteraction]);

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
      <div className="min-h-[50vh] flex items-center justify-center flex-col">
        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">Spirit not found or an error occurred.</p>
        <Link
          to={`/category/${parentCategoryId || ''}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Overview
        </Link>
      </div>
    );
  }

  // --- Main Content Rendering with all fields ---
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
          <TransitionImage
            // Use spirit.image_url and provide a fallback if it's null or undefined
            src={spirit.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
            alt={spirit.name}
            className="w-full max-w-xs md:max-w-md rounded-lg shadow-lg object-contain"
            width={300} // Consider setting a fixed width/height for image container
            height={400}
          />
        </div>

        {/* Spirit Details Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {spirit.name}
          </h1>
          {spirit.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
              {spirit.description}
            </p>
          )}

          {spirit.abv && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">ABV:</span> {spirit.abv}%
            </p>
          )}

          {spirit.price_range && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-semibold">Price Range:</span> {spirit.price_range}
            </p>
          )}

          {/* Display Tasting Notes */}
          {/* Ensure getTastingNotesForSpirit returns an array of { term, percentage } */}
          {tastingNotes && tastingNotes.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Tasting Notes</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {tastingNotes.map((note, index) => (
                  <li key={index}>{note.term} ({note.percentage.toFixed(0)}%)</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display History */}
          {spirit.history && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">History</h2>
              <p className="text-gray-700 dark:text-gray-300">{spirit.history}</p>
            </div>
          )}

          {/* Display Fun Facts */}
          {spirit.fun_facts && spirit.fun_facts.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Fun Facts</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {spirit.fun_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Myths */}
          {spirit.myths && spirit.myths.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Myths</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {spirit.myths.map((myth, index) => (
                  <li key={index}>{myth}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add more details here as needed */}
        </div>
      </div>
    </div>
  );
};

export default SpiritProfilePage;