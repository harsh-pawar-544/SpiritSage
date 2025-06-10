import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext'; // Make sure this path is correct
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types'; // Import the Brand type

// New component to display related spirits/brands for a given subtype
interface RelatedSpiritsProps {
  subtypeId: string;
}

const RelatedSpirits: React.FC<RelatedSpiritsProps> = ({ subtypeId }) => {
  const { getBrandsBySubtypeId } = useSpirits(); // Now using getBrandsBySubtypeId
  const [brands, setBrands] = useState<Brand[]>([]); // State for brands
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  useEffect(() => {
    const fetchBrands = () => { // No longer async as data is in-memory
      try {
        setIsLoadingBrands(true);
        const data = getBrandsBySubtypeId(subtypeId); // Directly get from in-memory data
        // Take a few examples, e.g., the first 3 or 4
        setBrands(data.slice(0, 4));
      } catch (error) {
        console.error(`Error fetching brands for subtype ${subtypeId}:`, error);
        setBrands([]); // Clear brands on error
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [subtypeId, getBrandsBySubtypeId]); // Dependencies: subtypeId and the memoized function

  if (isLoadingBrands) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-500 dark:text-gray-400">Loading examples...</p>
      </div>
    );
  }

  if (!brands.length) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No examples found for this type.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Popular Examples</h4>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {brands.map((brand) => ( // Mapping over brands
          // Wrap the entire brand card content in a Link component
          <Link
            key={brand.id}
            to={`/spirit/${brand.id}`} // Link to the spirit (brand) detail page
            className="flex-none w-48 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200" // Added group and hover styles for Link
          >
            <div className="relative w-full h-32">
              <TransitionImage
                src={brand.image || 'https://via.placeholder.com/150'} // Use brand.image or brand.image_url
                alt={brand.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added group-hover scale
              />
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{brand.name}</h5>
              </div>
              {brand.price_range && ( // Use brand.price_range for price
                <p className="text-md font-bold text-gray-900 dark:text-white mt-2">{brand.price_range}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


const SpiritSubtypesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSubtypesByCategoryId } = useSpirits();
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
            to={`/alcohol-type/${id}`}
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
            className="group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              {/* Subtype Card Header */}
              <div
                className="relative aspect-[4/3] cursor-pointer"
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
              <div className="p-4"></div>
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