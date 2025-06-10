import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';

// Define a simple type for a Spirit/Product example
interface SpiritExample {
  id: string;
  name: string;
  image_url: string; // Assuming your spirits have an image URL
  ratings?: number;
  average_rating?: number;
  price?: string; // Or number, depending on your data
  save_percentage?: number;
}

// New component to display related spirits/brands for a given subtype
interface RelatedSpiritsProps {
  subtypeId: string;
}

const RelatedSpirits: React.FC<RelatedSpiritsProps> = ({ subtypeId }) => {
  const { getSpiritsBySubtypeId } = useSpirits(); // We'll assume this function exists in your context
  const [spirits, setSpirits] = useState<SpiritExample[]>([]);
  const [isLoadingSpirits, setIsLoadingSpirits] = useState(true);

  useEffect(() => {
    const fetchSpirits = async () => {
      try {
        setIsLoadingSpirits(true);
        // Assuming getSpiritsBySubtypeId fetches spirits
        // We might need to implement this in SpiritsContext if it's not there
        const data = await getSpiritsBySubtypeId(subtypeId);
        // Take a few examples, e.g., the first 3 or 4
        setSpirits(data.slice(0, 4));
      } catch (error) {
        console.error(`Error fetching spirits for subtype ${subtypeId}:`, error);
        setSpirits([]); // Clear spirits on error
      } finally {
        setIsLoadingSpirits(false);
      }
    };

    fetchSpirits();
  }, [subtypeId, getSpiritsBySubtypeId]);

  if (isLoadingSpirits) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-500 dark:text-gray-400">Loading examples...</p>
      </div>
    );
  }

  if (!spirits.length) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No examples found for this type.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Popular Examples</h4>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"> {/* Added scrollbar-hide for cleaner look */}
        {spirits.map((spirit) => (
          <div key={spirit.id} className="flex-none w-48 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="relative w-full h-32">
              <TransitionImage
                src={spirit.image_url || 'https://via.placeholder.com/150'} // Fallback image
                alt={spirit.name}
                className="w-full h-full object-cover"
              />
              {spirit.save_percentage && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save {spirit.save_percentage}%
                </span>
              )}
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white line-clamp-2">{spirit.name}</h5>
                {spirit.average_rating && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="text-yellow-500 mr-1">★</span>{spirit.average_rating} ({spirit.ratings} ratings)
                  </div>
                )}
              </div>
              {spirit.price && (
                <p className="text-md font-bold text-gray-900 dark:text-white mt-2">{spirit.price}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const SpiritSubtypesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSubtypesByCategoryId } = useSpirits(); // Renamed from getCategoriesById for clarity
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubtypes = async () => {
      if (!id) return;

      try {
        const data = await getSubtypesByCategoryId(id);
        setSubtypes(data);
      } catch (error) {
        console.error('Error fetching subtypes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtypes();
  }, [id, getSubtypesByCategoryId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!subtypes.length) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">No subtypes found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to={`/alcohol-type/${id}`} // Assuming this goes back to the main category overview
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Types of {subtypes[0]?.category_name || 'Spirit'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtypes.map(subtype => (
          <div
            key={subtype.id}
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl overflow-hidden" // Removed cursor-pointer from outer div for now
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              {/* Subtype Card Header */}
              <div
                className="relative aspect-[4/3] cursor-pointer" // Added cursor-pointer to the image/header section
                onClick={() => navigate(`/subtype/${subtype.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/subtype/${subtype.id}`);
                  }
                }}
              >
                <TransitionImage
                  src={subtype.image}
                  alt={subtype.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-2">{subtype.name}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{subtype.description}</p>
                </div>
              </div>

              {/* Related Spirits/Brands Section */}
              <div className="p-4"> {/* Added padding for the content within the card */}
                <RelatedSpirits subtypeId={subtype.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpiritSubtypesPage;