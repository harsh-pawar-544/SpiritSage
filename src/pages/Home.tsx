import React from 'react';
import { GlassWater } from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import RecommendedSpirits from '../components/RecommendedSpirits';

const Home: React.FC = () => {
  const { theme, language } = useUserPreferences();

  return (
    <div className={`space-y-12 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <GlassWater className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to SpiritSage
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your AI-powered companion for exploring spirits and liquors
          {language !== 'en' && (
            <span className="block mt-2 text-sm">
              Language: {language.toUpperCase()}
            </span>
          )}
        </p>
        <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
      </div>

      <RecommendedSpirits />
    </div>
  );
};

export default Home;