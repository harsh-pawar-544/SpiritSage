import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategoryById } = useSpirits();
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!id) return;
      try {
        const data = await getCategoryById(id);
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [id, getCategoryById]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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

  const handleExploreSubtypes = () => {
    navigate(`/category/${id}/subtypes`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {category.name}
        </h1>
      </div>

      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <TransitionImage
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-4xl font-bold text-white mb-4">{category.name}</h2>
          <p className="text-xl text-gray-200">{category.description}</p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleExploreSubtypes}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium group"
        >
          Explore {category.name} Types
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SpiritOverviewPage;