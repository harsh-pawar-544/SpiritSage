import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, History, Globe, Droplet, Award, ChevronRight } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategoryById, loading } = useSpirits();
  
  const category = id ? getCategoryById(id) : null;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Loading...</p>
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
          to="/explore"
          className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {category.name} Guide
        </h1>
      </div>

      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img
          src={category.image || 'https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg'}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-4xl font-bold mb-4">{category.name}</h2>
          <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <History className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold">History</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {category.history}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold">Fun Facts</h2>
            </div>
            <ul className="space-y-4">
              {category.fun_facts.map((fact, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
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