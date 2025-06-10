import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types'; // Make sure your Brand type includes the new fields!

const SpiritProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // This 'id' is the brandId
  const { getBrandById, getTastingNotesForSpirit } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [isLoading, setIsLoading] = useState(true);
  const [tastingNotes, setTastingNotes] = useState<Array<{ term: string; percentage: number }>>([]);
  const [spirit, setSpirit] = useState<Brand | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);

      Promise.all([
        getBrandById(id),
        getTastingNotesForSpirit(id)
      ])
        .then(([spiritData, tastingNotesData]) => {
          console.log("SpiritProfilePage: Raw spiritData from getBrandById (with new fields):", spiritData);
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
        {/* Fallback link to a general explore page */}
        <Link
          to={`/explore`} // Go back to the general explore page
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Explore
        </Link>
      </div>
    );
  }

  // --- Main Content Rendering with all fields ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Only Back to Alcohol Type (Category) Link */}
      {spirit.alcohol_type_id && spirit.alcohol_type_name && (
        <Link
          to={`/alcohol-type/${spirit.alcohol_type_id}`} // CORRECTED PATH: Use /alcohol-type/:id
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group" // Removed ml-4, changed mb-4 to mb-8
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to {spirit.alcohol_type_name} Category
        </Link>
      )}

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

          {/* Display parent categories (inline links) */}
          <div className="mt-4">
            {spirit.subtype_name && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-semibold">Subtype:</span>{' '}
                <Link
                  to={`/subtype/${spirit.subtype_id}`} // Link to the specific subtype detail page
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {spirit.subtype_name}
                </Link>
              </p>
            )}
            {spirit.alcohol_type_name && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-semibold">Alcohol Type:</span>{' '}
                <Link
                  to={`/alcohol-type/${spirit.alcohol_type_id}`} // Link to the specific alcohol type detail page
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {spirit.alcohol_type_name}
                </Link>
              </p>
            )}
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default SpiritProfilePage;