import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { useSpirits } from './SpiritsContext';// Import SpiritsContext for fetching real data
import { AlcoholType, Subtype, Brand } from '../data/types'; // Import relevant types
import { RecommendedSpiritItem } from '../components/RecommendedSpirits'; // Import the shared interface

// Define an interface for interactions that includes the spirit's UUID and its type
interface Interaction {
  spiritId: string; // This should be the UUID from the database
  spiritType: 'alcohol_type' | 'subtype' | 'brand'; // Crucial for fetching
  type: 'view' | 'rate' | 'favorite';
  timestamp: number;
  rating?: number;
}

// Update the context type to reflect the new structure of recommendedSpirits
interface RecommendationsContextType {
  recommendedSpirits: RecommendedSpiritItem[]; // Now an array of full objects
  trackInteraction: (spiritId: string, spiritType: Interaction['spiritType'], type: Interaction['type'], data?: { rating?: number; comment?: string }) => void;
  clearInteractionHistory: () => void;
  isLoading: boolean;
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
  const [recommendedSpiritIds, setRecommendedSpiritIds] = useState<string[]>([]); // Intermediate state for IDs
  const [recommendedSpirits, setRecommendedSpirits] = useState<RecommendedSpiritItem[]>([]); // Final state for full spirit objects
  const [isLoading, setIsLoading] = useState(true);

  // Get the fetching functions and data arrays from SpiritsContext
  const {
    alcoholTypes,
    subtypes,
    brands,
    loading: spiritsContextLoading, // Consider spirits context loading as well
    error: spiritsContextError
  } = useSpirits();

  // Load interactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInteractions(parsed);
        console.log("RecommendationsContext: Loaded interactions from localStorage. Count:", parsed.length);
      } catch (error) {
        console.error('RecommendationsContext: Error loading interactions from localStorage:', error);
      }
    }
    // Set isLoading to false only after initial load of interactions AND spiritsContext is ready
    // We'll manage overall loading with the main recommendation update useEffect
  }, []);

  // Save interactions to localStorage whenever they change
  // This useEffect ensures localStorage is always up-to-date
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
    console.log("RecommendationsContext: Interactions updated and saved to localStorage. Current count:", interactions.length);
    if (interactions.length > 0) {
      console.log("RecommendationsContext: Latest interaction:", interactions[0]);
    }
  }, [interactions]);

  // --- Core Recommendation Logic (Memoized for stability) ---

  // Step 1: Calculate scores for interacted spirits (by UUID)
  const calculateSpiritScores = useCallback(() => {
    const now = Date.now();
    const scores = new Map<string, number>(); // Map UUID to score
    const categoryScores = new Map<string, number>(); // To prioritize diverse categories

    console.log("RecommendationsContext: Starting calculateSpiritScores.");
    console.log("RecommendationsContext: Current Interactions count:", interactions.length);

    interactions.forEach(interaction => {
      const age = (now - interaction.timestamp) / (1000 * 60 * 60 * 24); // Age in days
      const timeDecay = Math.exp(-age / 30); // Exponential decay over 30 days
      const weight = INTERACTION_WEIGHTS[interaction.type];
      const score = weight * timeDecay;

      scores.set(
        interaction.spiritId,
        (scores.get(interaction.spiritId) || 0) + score + (interaction.rating ? (interaction.rating / 5) * 2 : 0)
      );

      let mainCategory = '';
      if (interaction.spiritType === 'alcohol_type') {
        mainCategory = interaction.spiritId;
      } else if (interaction.spiritType === 'subtype') {
        const subtype = subtypes?.find(s => s.id === interaction.spiritId);
        mainCategory = subtype?.alcohol_type_id || '';
      } else if (interaction.spiritType === 'brand') {
        const brand = brands?.find(b => b.id === interaction.spiritId);
        const subtype = subtypes?.find(s => s.id === brand?.subtype_id);
        mainCategory = subtype?.alcohol_type_id || '';
      }

      if (mainCategory) {
        categoryScores.set(
          mainCategory,
          (categoryScores.get(mainCategory) || 0) + score
        );
      }
    });

    const allUniqueSpiritIds: { id: string; type: 'alcohol_type' | 'subtype' | 'brand'; categoryId: string }[] = [];

    alcoholTypes?.forEach(at => allUniqueSpiritIds.push({ id: at.id, type: 'alcohol_type', categoryId: at.id }));
    subtypes?.forEach(st => allUniqueSpiritIds.push({ id: st.id, type: 'subtype', categoryId: st.alcohol_type_id }));
    brands?.forEach(b => {
      const subtype = subtypes?.find(s => s.id === b.subtype_id);
      allUniqueSpiritIds.push({ id: b.id, type: 'brand', categoryId: subtype?.alcohol_type_id || '' });
    });

    console.log("RecommendationsContext: All unique spirit IDs collected. Count:", allUniqueSpiritIds.length);
    if (allUniqueSpiritIds.length === 0) {
      console.warn("RecommendationsContext: No unique spirits loaded from SpiritsContext! Check SpiritsContext data.");
      console.log("SpiritsContext Data - AlcoholTypes length:", alcoholTypes?.length, "Subtypes length:", subtypes?.length, "Brands length:", brands?.length);
    }

    const rankedSpiritIds = allUniqueSpiritIds
      .map(spirit => ({
        id: spirit.id,
        type: spirit.type,
        categoryId: spirit.categoryId,
        score: scores.get(spirit.id) || 0,
        categoryScore: categoryScores.get(spirit.categoryId) || 0
      }))
      .sort((a, b) => b.score - a.score);

    console.log("RecommendationsContext: calculateSpiritScores - Ranked spirits count:", rankedSpiritIds.length);
    return rankedSpiritIds;
  }, [interactions, alcoholTypes, subtypes, brands]); // Dependencies: interactions and all spirit data from SpiritsContext

  // Step 2: Select top recommendations (UUIDs) with diversity
  const selectTopRecommendations = useCallback((rankedSpiritIds: ReturnType<typeof calculateSpiritScores>) => {
    const recommendations: string[] = [];
    const usedCategories = new Set<string>();

    console.log("RecommendationsContext: Starting selectTopRecommendations.");
    for (const spirit of rankedSpiritIds) {
      if (recommendations.length >= RECOMMENDATION_COUNT) break;

      if (!usedCategories.has(spirit.categoryId)) {
        recommendations.push(spirit.id);
        usedCategories.add(spirit.categoryId);
      }
    }

    for (const spirit of rankedSpiritIds) {
      if (recommendations.length >= RECOMMENDATION_COUNT) break;
      if (!recommendations.includes(spirit.id)) {
        recommendations.push(spirit.id);
      }
    }

    if (recommendations.length < RECOMMENDATION_COUNT) {
      const remainingSpirits = rankedSpiritIds
        .filter(s => !recommendations.includes(s.id))
        .sort(() => Math.random() - 0.5);

      for (const spirit of remainingSpirits) {
        if (recommendations.length >= RECOMMENDATION_COUNT) break;
        recommendations.push(spirit.id);
      }
    }
    console.log("RecommendationsContext: selectTopRecommendations - Top IDs selected:", recommendations);
    return recommendations;
  }, []);

  // Step 3: Fetch full spirit details for the recommended UUIDs
  const fetchRecommendedSpiritDetails = useCallback(async (ids: string[]) => {
    console.log("RecommendationsContext: Starting fetchRecommendedSpiritDetails for IDs:", ids);
    const fetchedDetails: RecommendedSpiritItem[] = [];
    const fetchPromises = ids.map(async id => {
      let spirit: AlcoholType | Subtype | Brand | undefined;
      let type: RecommendedSpiritItem['type'] | undefined;

      spirit = brands?.find(b => b.id === id);
      if (spirit) { type = 'brand'; }
      else {
        spirit = subtypes?.find(s => s.id === id);
        if (spirit) { type = 'subtype'; }
        else {
          spirit = alcoholTypes?.find(at => at.id === id);
          if (spirit) { type = 'alcohol_type'; }
        }
      }

      if (spirit && type) {
        fetchedDetails.push({
          id: spirit.id,
          name: spirit.name,
          image_url: (spirit as any).image || 'https://via.placeholder.com/150.png?text=Spirit',
          type: type,
        });
      } else {
        console.warn(`RecommendationsContext: Could not find details for recommended spirit ID: ${id}.`);
      }
    });

    await Promise.all(fetchPromises);
    console.log("RecommendationsContext: fetchRecommendedSpiritDetails - Full details count:", fetchedDetails.length);
    console.log("RecommendationsContext: Final recommended spirits:", fetchedDetails);
    return fetchedDetails;
  }, [alcoholTypes, subtypes, brands]);

  // --- Main Function to Update Recommendations (Debounced) ---
  // This function is now stable because its dependencies (the useCallback functions) are stable.
  const debouncedUpdateRecommendations = useCallback(
    debounce(async () => {
      console.log("RecommendationsContext: debouncedUpdateRecommendations triggered.");

      if (spiritsContextLoading || spiritsContextError) {
        console.log("RecommendationsContext: SpiritsContext still loading or error, deferring recommendations.", { spiritsContextLoading, spiritsContextError });
        setIsLoading(true);
        return;
      }
      setIsLoading(true);

      const ranked = calculateSpiritScores();
      const topIds = selectTopRecommendations(ranked);
      setRecommendedSpiritIds(topIds);

      const fullDetails = await fetchRecommendedSpiritDetails(topIds);
      setRecommendedSpirits(fullDetails);
      setIsLoading(false);
      console.log("RecommendationsContext: Recommendations update complete.");
    }, 500),
    [calculateSpiritScores, selectTopRecommendations, fetchRecommendedSpiritDetails, spiritsContextLoading, spiritsContextError]
  );

  // --- Effect for Initial Load, SpiritsContext Changes, AND Interactions Changes ---
  // This is the key useEffect that drives the recommendation update.
  // It will run when the component mounts, or when any of its dependencies change.
  useEffect(() => {
    console.log("RecommendationsContext: Recommendation update useEffect triggered. isLoading:", isLoading, "spiritsContextLoading:", spiritsContextLoading, "spiritsContextError:", spiritsContextError, "Interactions count:", interactions.length);
    if (!spiritsContextLoading && !spiritsContextError) {
      // Trigger update only when all necessary data (from SpiritsContext) is loaded AND interactions have changed
      debouncedUpdateRecommendations();
    } else {
      setIsLoading(true); // Keep loading state true if SpiritsContext data isn't ready
    }
  }, [interactions, spiritsContextLoading, spiritsContextError, debouncedUpdateRecommendations]); // Added 'interactions' as a dependency

  // --- Interaction Tracking (NOW STABLE) ---
  const trackInteraction = useCallback(
    (
      spiritId: string,
      spiritType: Interaction['spiritType'],
      type: Interaction['type'],
      data?: { rating?: number; comment?: string }
    ) => {
      setInteractions(prev => {
        const newInteraction = {
          spiritId,
          spiritType,
          type,
          timestamp: Date.now(),
          ...(data?.rating !== undefined ? { rating: data.rating } : {})
        };
        // Add new interaction to the beginning, keep it recent-first for logging
        const newInteractions = [
          newInteraction,
          ...prev
        ].slice(0, MAX_INTERACTIONS);

        console.log("RecommendationsContext: trackInteraction called.", newInteraction);
        console.log("RecommendationsContext: Interactions state will be updated. New count (pending):", newInteractions.length);
        return newInteractions;
      });
      // REMOVED: debouncedUpdateRecommendations() call here.
      // The useEffect above will now trigger the update when 'interactions' changes.
    },
    [setInteractions] // Dependency for useCallback: only setInteractions. It's guaranteed stable.
  );

  const clearInteractionHistory = useCallback(() => {
    setInteractions([]);
    setRecommendedSpiritIds([]);
    setRecommendedSpirits([]);
    console.log("RecommendationsContext: Interaction history cleared.");
  }, []); // No dependencies for this function

  const contextValue = useMemo(() => ({
    recommendedSpirits,
    trackInteraction,
    clearInteractionHistory,
    isLoading // Use the internal isLoading state
  }), [recommendedSpirits, trackInteraction, clearInteractionHistory, isLoading]);

  return (
    <RecommendationsContext.Provider value={contextValue}>
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