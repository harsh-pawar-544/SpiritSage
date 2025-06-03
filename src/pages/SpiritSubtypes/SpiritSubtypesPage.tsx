import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Dialog } from '../../components/ui/dialog';
import RatingStars from '../../components/RatingStars';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface AlcoholType {
  id: string;
  name: string;
  description: string;
}

interface Subtype {
  id: string;
  name: string;
  description: string;
  image: string;
  alcohol_type_id: string;
}

const SpiritSubtypesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRatingsForSpirit } = useSpirits();
  
  const [category, setCategory] = useState<AlcoholType | null>(null);
  const [subtypes, setSubtypes] = useState<Subtype[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndSubtypes = async () => {
      if (!id) return;

      try {
        // Fetch the main category (alcohol type)
        const { data: typeData, error: typeError } = await supabase
          .from('alcohol_types')
          .select('*')
          .eq('id', id)
          .single();

        if (typeError) {
          console.error('Error fetching alcohol type:', typeError);
          setCategory(null);
          return;
        }

        if (!typeData) {
          console.error('No alcohol type found with id:', id);
          setCategory(null);
          return;
        }

        setCategory(typeData);

        // Fetch associated subtypes
        const { data: subtypesData, error: subtypesError } = await supabase
          .from('subtypes')
          .select('*')
          .eq('alcohol_type_id', typeData.id);

        if (subtypesError) {
          console.error('Error fetching subtypes:', subtypesError);
          setSubtypes([]);
          return;
        }

        setSubtypes(subtypesData || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndSubtypes();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xl">Loading...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to All Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Types of {category.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subtypes.map(subtype => {
          const ratings = getRatingsForSpirit(subtype.id);
          const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

          return (
            <Dialog key={subtype.id}>
              <div
                className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
                onClick={() => navigate(`/spirits/subtype/${subtype.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/spirits/subtype/${subtype.id}`);
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
                      <div className="flex items-center space-x-2 mb-2">
                        <RatingStars rating={Math.round(avgRating)} size="sm" />
                        <span className="text-white text-sm">
                          ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-2">{subtype.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
};

export default SpiritSubtypesPage;