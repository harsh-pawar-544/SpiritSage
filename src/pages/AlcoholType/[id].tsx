import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { AlcoholType } from '../../data/types';

const AlcoholTypeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAlcoholTypeById, loading: spiritsContextLoading, error: spiritsContextError } = useSpirits();
  const [alcoholType, setAlcoholType] = useState<AlcoholType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlcoholTypeDetails = async () => {
      if (!id) {
        setError('No alcohol type ID provided.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAlcoholTypeById(id);
        if (data) {
          setAlcoholType(data);
        } else {
          setError('Alcohol type not found.');
        }
      } catch (err: any) {
        console.error('Error fetching alcohol type details:', err);
        setError(err.message || 'Failed to load alcohol type details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlcoholTypeDetails();
  }, [id, getAlcoholTypeById]);

  if (isLoading || spiritsContextLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading alcohol type...</p>
      </div>
    );
  }

  if (error || spiritsContextError || !alcoholType) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-red-600 dark:text-red-400">
          Error: {error || spiritsContextError || 'Alcohol type not found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/explore"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Explore
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
        <div className="relative rounded-lg overflow-hidden shadow-lg aspect-square">
          {alcoholType.image && (
            <TransitionImage
              src={alcoholType.image}
              alt={alcoholType.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{alcoholType.name}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{alcoholType.description}</p>

          {alcoholType.history && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">History</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{alcoholType.history}</p>
            </div>
          )}

          {alcoholType.fun_facts && alcoholType.fun_facts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Fun Facts</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {alcoholType.fun_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {alcoholType.myths && alcoholType.myths.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Myths & Misconceptions</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {alcoholType.myths.map((myth, index) => (
                  <li key={index}>{myth}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {alcoholType.subtypes && alcoholType.subtypes.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to={`/alcohol-type/${alcoholType.id}/subtypes`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Explore Types of {alcoholType.name}
            <ArrowLeft className="w-5 h-5 ml-2 transform rotate-180" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default AlcoholTypeDetailPage;