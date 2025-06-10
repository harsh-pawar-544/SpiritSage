import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';

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
            className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
            onClick={() => navigate(`/subtype/${subtype.id}`)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/subtype/${subtype.id}`);
              }
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[4/3]">
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
              {/* This is where the 'RelatedSpirits' component was previously rendered */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpiritSubtypesPage;