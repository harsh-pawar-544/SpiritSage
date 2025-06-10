import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types';

const SpiritProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // This 'id' is the brandId
  const { getBrandById, getTastingNotesForSpirit } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [isLoading, setIsLoading] = useState(true);
  const [tastingNotes, setTastingNotes] = useState<Array<{ term: string; percentage: number }>>([]);
  const [spirit, setSpirit] = useState<Brand | null>(null);
  // const [similarSpirits, setSimilarSpirits] = useState<any[]>([]); // This state is not used
  // const parentCategoryId = id?.split('-')[0]; // <-- REMOVE OR COMMENT OUT THIS LINE

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      Promise.all([
        getBrandById(id),
        getTastingNotesForSpirit(id)
      ])
        .then(([spiritData, tastingNotesData]) => {
          console.log("SpiritProfilePage: Raw spiritData from getBrandById:", spiritData);
          console.log("SpiritProfilePage: image_url in raw spiritData:", spiritData?.image_url);
          
          setSpirit(spiritData);
          setTastingNotes(tastingNotesData || []);
          setIsLoading(false);

          if (spiritData) {
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
        {/* Fallback link in case spirit data isn't found */}
        <Link
          to={`/category/`} // Go back to a general categories page if parent is unknown
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Categories
        </Link>
      </div>
    );
  }

  // Use spirit.subtype_id directly for the "Back to Subtypes" link
  // Ensure spirit.subtype_id exists before using it, fallback to '/' if needed.
  const subtypeIdToNavigate = spirit.subtype_id;

  // --- Main Content Rendering with all fields ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        // Use spirit.subtype_id here
        to={`/category/${subtypeIdToNavigate || ''}`} 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Subtypes
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Spirit Image Section */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-full max-w-xs md:max-w-md h-96">
            <TransitionImage
              src={spirit.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={spirit.name}
              className="w-full h-full object-contain rounded-lg shadow-lg"
              width={300}
              height={400}
            />
          </div>
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