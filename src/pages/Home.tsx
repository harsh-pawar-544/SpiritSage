import React from 'react';
import { Link } from 'react-router-dom';
import { GlassWater, ArrowRight } from 'lucide-react';
import RecommendedSpirits from '../components/RecommendedSpirits';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center">
          <GlassWater className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Your AI-Powered Spirit Assistant
        </h1>
        <div className="h-1 w-32 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full" />
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Discover your perfect spirit with personalized recommendations powered by artificial intelligence
        </p>
        
        <Link
          to="/explore"
          className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full text-lg font-medium transition-colors group"
        >
          Start Exploring
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="w-full max-w-7xl">
        <RecommendedSpirits />
      </div>
    </div>
  );
};

export default Home;