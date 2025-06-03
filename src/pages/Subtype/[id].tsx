import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Subtype, Brand } from '../../data/types';

const SubtypeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSubtypeById, getBrandsBySubtypeId, loading: spiritsContextLoading, error: spiritsContextError } = useSpirits();
  const [subtype, setSubtype] = useState<Subtype | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtypeDetails = async () => {
      if (!id) {
        setError('No subtype ID provided.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const subtypeData = await getSubtypeById(id);
        if (subtypeData) {
          setSubtype(subtypeData);
          setBrands(getBrandsBySubtypeId(subtypeData.id));
        } else {
          setError('Subtype not found.');
        }
      } catch (err: any) {
        console.error('Error fetching subtype details:', err);
        setError(err.message || 'Failed to load subtype details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtypeDetails();
  }, [id, getSubtypeById, getBrandsBySubtypeId]);

  if (isLoading || spiritsContextLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading subtype...</p>
      </div>
    );
  }

  if (error || spiritsContextError || !subtype) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-red-600 dark:text-red-400">
          Error: {error || spiritsContextError || 'Subtype not found.'}
        </p>
      </div>
    );
  }

  const backToAlcoholTypeLink = subtype.alcohol_type_id ?
    `/alcohol-type/${subtype.alcohol_type_id}` :
    '/explore';

  const parentCategoryName = subtype.alcohol_types?.name || 'Category Overview';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to={backToAlcoholTypeLink}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to {parentCategoryName}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
        <div className="relative rounded-lg overflow-hidden shadow-lg aspect-square">
          {subtype.image && (
            <TransitionImage
              src={subtype.image}
              alt={subtype.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{subtype.name}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{subtype.description}</p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Key Details</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {subtype.region && <li>Region: {subtype.region}</li>}
              {(subtype.abv_min !== null && subtype.abv_max !== null) && (
                <li>Typical ABV Range: {subtype.abv_min}% - {subtype.abv_max}%</li>
              )}
              {subtype.production_method && <li>Production Method: {subtype.production_method}</li>}
            </ul>
          </div>

          {subtype.flavor_profile && subtype.flavor_profile.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Flavor Profile</h2>
              <div className="flex flex-wrap gap-2">
                {subtype.flavor_profile.map((profile, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    {profile}
                  </span>
                ))}
              </div>
            </div>
          )}

          {subtype.characteristics && subtype.characteristics.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Characteristics</h2>
              <div className="flex flex-wrap gap-2">
                {subtype.characteristics.map((char, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {subtype.history && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">History</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{subtype.history}</p>
            </div>
          )}

          {subtype.fun_facts && subtype.fun_facts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Fun Facts</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {subtype.fun_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {subtype.myths && subtype.myths.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Myths & Misconceptions</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {subtype.myths.map((myth, index) => (
                  <li key={index}>{myth}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {brands.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Explore {subtype.name} Brands
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/spirit/${brand.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {brand.image && (
                    <TransitionImage
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{brand.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{brand.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SubtypeDetailPage;