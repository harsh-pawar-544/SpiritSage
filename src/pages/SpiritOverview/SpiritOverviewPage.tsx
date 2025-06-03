import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, History, Globe, Droplet, Award, ChevronRight } from 'lucide-react';
import { spiritCategories } from '../../data/spiritCategories';
import TransitionImage from '../../components/ui/TransitionImage';

const SpiritOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = spiritCategories.find(cat => cat.id === id);

  if (!category) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600 dark:text-gray-400">Category not found</p>
      </div>
    );
  }

  const regions = category.subtypes.reduce((acc, subtype) => {
    const origin = subtype.details.stats?.origin;
    if (origin && !acc.some(r => r.name === origin)) {
      acc.push({
        name: origin,
        description: subtype.details.tastingNotes,
        image: subtype.image
      });
    }
    return acc;
  }, [] as { name: string; description: string; image: string }[]);

  const facts = category.subtypes.reduce((acc, subtype) => {
    if (subtype.details.funFacts) {
      acc.push(...subtype.details.funFacts);
    }
    return acc;
  }, [] as string[]);

  const myths = category.subtypes.reduce((acc, subtype) => {
    if (subtype.details.myths) {
      acc.push(...subtype.details.myths);
    }
    return acc;
  }, [] as string[]);

  const handleExploreSubtypes = () => {
    navigate(`/category/${id}/subtypes`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
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

      {/* Hero Section */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <TransitionImage
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-5xl font-bold mb-4">{category.name}</h2>
          <p className="text-xl text-gray-200 max-w-2xl leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* History, Myths & Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <History className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold">History</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {category.subtypes[0]?.details.history}
          </div>
        </div>

        <div className="space-y-8">
          {/* Fun Facts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Info className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold">Did You Know?</h2>
            </div>
            <ul className="space-y-4">
              {facts.slice(0, 3).map((fact, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Myths */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold">Common Myths</h2>
            </div>
            <ul className="space-y-4">
              {myths.slice(0, 3).map((myth, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-2xl">❌</span>
                  <span className="text-gray-700 dark:text-gray-300">{myth}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Regions */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold">Regional Styles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group"
            >
              <div className="relative h-48">
                <TransitionImage
                  src={region.image}
                  alt={region.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-semibold text-white">{region.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {region.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production & Characteristics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Droplet className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold">Production & Characteristics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Production Method</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {category.subtypes[0]?.details.productionMethod}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Characteristics</h3>
            <div className="flex flex-wrap gap-2">
              {category.subtypes[0]?.details.characteristics.map((char, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explore Subtypes Button */}
      <div className="text-center">
        <button
          onClick={handleExploreSubtypes}
          className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-lg font-medium group"
        >
          Explore {category.name} Types
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SpiritOverviewPage;