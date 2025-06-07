import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { spiritCategories } from '../data/spiritCategories';
import { useSpirits } from './SpiritsContext'; // Assuming you import this for getRatingsForBrand, though it's not currently used in this file's logic

interface Interaction {
  spiritId: string;
  type: 'view' | 'rate' | 'favorite';
  timestamp: number;
  rating?: number;
}

interface RecommendationsContextType {
  recommendedSpirits: string[];
  trackInteraction: (spiritId: string, type: Interaction['type'], data?: { rating?: number; comment?: string }) => void;
  clearInteractionHistory: () => void;
  isLoading: boolean;
  // getRatingsForBrand is exposed by useSpirits, not RecommendationsContext directly.
  // It's listed in the interface, but it's not being provided by this context.
  // If you meant to expose it here, you'd need to add it to the value object.
}

const STORAGE_KEY = 'spiritsage_interactions';
const MAX_INTERACTIONS = 100;
const RECOMMENDATION_COUNT = 5;
const INTERACTION_WEIGHTS = {
  view: 1,
  rate: 3,
  favorite: 2,
};

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [recommendedSpirits, setRecommendedSpirits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Note: getRatingsForBrand is imported from useSpirits but not currently used in the logic below.
  // If you intend to use it within these memoized functions, ensure it's stable.
  // const { getRatingsForBrand } = useSpirits();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInteractions(parsed);
      } catch (error) {
        console.error('Error loading interactions:', error);
      }
    }
    setIsLoading(false);
  }, []); // Runs once on mount

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
  }, [interactions]); // Runs whenever 'interactions' state changes

  // --- Memoized Functions ---

  const calculateSpiritScores = useCallback(() => {
    const now = Date.now();
    const scores = new Map<string, number>();
    const categories = new Set<string>();

    interactions.forEach(interaction => {
      const age = (now - interaction.timestamp) / (1000 * 60 * 60 * 24);
      const timeDecay = Math.exp(-age / 30);
      const weight = INTERACTION_WEIGHTS[interaction.type];
      const score = weight * timeDecay;

      scores.set(
        interaction.spiritId,
        (scores.get(interaction.spiritId) || 0) + score + (interaction.rating ? (interaction.rating / 5) * 2 : 0)
      );

      const category = interaction.spiritId.split('-')[0];
      categories.add(category);
    });

    return { scores, categories };
  }, [interactions]); // This function depends on 'interactions' state

  // updateRecommendations is debounced, and depends on calculateSpiritScores
  const updateRecommendations = useCallback(
    debounce(() => {
      const { scores, categories } = calculateSpiritScores();
      const recommendations: string[] = [];
      const usedCategories = new Set<string>();

      const allSpirits = spiritCategories.flatMap(cat => cat.subtypes); // spiritCategories is static, no dependency needed

      const rankedSpirits = allSpirits
        .map(spirit => ({
          id: spirit.id,
          score: scores.get(spirit.id) || 0,
          category: spirit.id.split('-')[0]
        }))
        .sort((a, b) => b.score - a.score);

      // First, add the highest-scored spirit from each category
      for (const { id, category } of rankedSpirits) {
        if (recommendations.length >= RECOMMENDATION_COUNT) break;
        if (!usedCategories.has(category)) {
          recommendations.push(id);
          usedCategories.add(category);
        }
      }

      // Then fill remaining slots with highest-scored spirits regardless of category
      for (const { id, category } of rankedSpirits) {
        if (recommendations.length >= RECOMMENDATION_COUNT) break;
        if (!recommendations.includes(id)) {
          recommendations.push(id);
        }
      }

      // If we still don't have enough recommendations, add random spirits
      if (recommendations.length < RECOMMENDATION_COUNT) {
        const remainingSpirits = allSpirits
          .filter(spirit => !recommendations.includes(spirit.id))
          .sort(() => Math.random() - 0.5);

        for (const spirit of remainingSpirits) {
          if (recommendations.length >= RECOMMENDATION_COUNT) break;
          recommendations.push(spirit.id);
        }
      }

      setRecommendedSpirits(recommendations);
    }, 500),
    [calculateSpiritScores] // Depends on 'calculateSpiritScores'
  );

  const trackInteraction = useCallback(
    (
      spiritId: string,
      type: Interaction['type'],
      data?: { rating?: number; comment?: string }
    ) => {
      setInteractions(prev => {
        const newInteractions = [
          {
            spiritId,
            type,
            timestamp: Date.now(),
            ...(data?.rating !== undefined ? { rating: data.rating } : {})
          },
          ...prev
        ].slice(0, MAX_INTERACTIONS);

        return newInteractions;
      });

      // Call the debounced function
      updateRecommendations();
    },
    [updateRecommendations] // Depends on 'updateRecommendations'
  );

  const clearInteractionHistory = useCallback(() => {
    setInteractions([]);
    setRecommendedSpirits([]);
  }, []); // No external dependencies

  // Effect to update recommendations when interactions change
  // This useEffect calls updateRecommendations without debouncing in case of a direct setInteractions
  // from local storage loading, to ensure initial recommendations are generated.
  useEffect(() => {
    if (!isLoading) { // Only run once initial loading is done
        updateRecommendations();
    }
  }, [interactions, updateRecommendations, isLoading]); // Depends on 'interactions' and 'updateRecommendations'

  return (
    <RecommendationsContext.Provider
      value={{
        recommendedSpirits,
        trackInteraction,
        clearInteractionHistory,
        isLoading
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};