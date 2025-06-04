import React from 'react';
import { GlassWater } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <GlassWater className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About SpiritSage</h1>
        <div className="h-1 w-20 bg-indigo-600 dark:bg-indigo-400 mx-auto rounded-full" />
      </div>

      <div className="space-y-8 text-lg text-gray-700 dark:text-gray-300">
        <p>
          SpiritSage is your intelligent companion in the world of fine spirits. We combine 
          artificial intelligence with expert knowledge to provide personalized recommendations, 
          detailed tasting notes, and fascinating insights into the history and culture of spirits.
        </p>

        <p>
          Our mission is to make the world of spirits more accessible and enjoyable for everyone, 
          from curious newcomers to seasoned connoisseurs. We believe that understanding the story 
          behind each spirit enhances the appreciation of its craftsmanship and character.
        </p>

        <p>
          Whether you're exploring new flavors, learning about traditional production methods, 
          or seeking the perfect spirit for a special occasion, SpiritSage is here to guide 
          you on your journey.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;