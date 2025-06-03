import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpirits } from '../../contexts/SpiritsContext';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import TransitionImage from '../../components/ui/TransitionImage';
import { Brand } from '../../data/types';

export default function SpiritProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getBrandById, getTastingNotesForSpirit } = useSpirits();
  const { trackInteraction } = useRecommendations();
  const [isLoading, setIsLoading] = useState(true);
  const [tastingNotes, setTastingNotes] = useState<Array<{ term: string; percentage: number }>>([]);
  const [spirit, setSpirit] = useState<Brand | null>(null);
  const [similarSpirits, setSimilarSpirits] = useState<any[]>([]);
  const parentCategoryId = id?.split('-')[0];

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      trackInteraction(id, 'view');

      Promise.all([
        getBrandById(id),
        getTastingNotesForSpirit(id)
      ])
        .then(([spiritData, tastingNotesData]) => {
          setSpirit(spiritData);
          setTastingNotes(tastingNotesData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setSpirit(null);
          setTastingNotes([]);
          setIsLoading(false);
        });
    }
  }, [id, getBrandById, getTastingNotesForSpirit, trackInteraction]);

  if (!spirit) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {isLoading ? (
          <p className="text-2xl text-gray-600 dark:text-gray-400">Loading spirit...</p>
        ) : (
          <p className="text-2xl text-gray-600 dark:text-gray-400">Spirit not found</p>
        )}
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`}>
      <Link
        to={`/category/${parentCategoryId}`}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Overview
      </Link>
    </div>
  );
}