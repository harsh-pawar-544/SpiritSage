import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSpirits } from './SpiritsContext'; // Import SpiritsContext for fetching real data
import { AlcoholType, Subtype, Brand, Rating } from '../data/types'; // Import relevant types
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
  // Note: getRatingsForBrand is part of useSpirits, not this context
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
        console.log("RecommendationsContext: Loaded interactions from localStorage. Count:", parsed.length); // Debug log
      } catch (error) {
        console.error('RecommendationsContext: Error loading interactions from localStorage:', error); // Debug error log
      }
    }
    setIsLoading(false); // Initial loading of interactions is done
  }, []);

  // Save interactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
    console.log("RecommendationsContext: Interactions updated and saved to localStorage. Current count:", interactions.length); // Debug log
    if (interactions.length > 0) {
      console.log("RecommendationsContext: Latest interaction:", interactions[0]); // Debug log
    }
  }, [interactions]);

  // --- Core Recommendation Logic ---

  // Step 1: Calculate scores for interacted spirits (by UUID)
  const calculateSpiritScores = useCallback(() => {
    const now = Date.now();
    const scores = new Map<string, number>(); // Map UUID to score
    const categoryScores = new Map<string, number>(); // To prioritize diverse categories

    console.log("RecommendationsContext: Starting calculateSpiritScores."); // Debug log
    console.log("RecommendationsContext: Current Interactions count:", interactions.length); // Debug log

    interactions.forEach(interaction => {
      const age = (now - interaction.timestamp) / (1000 * 60 * 60 * 24); // Age in days
      const timeDecay = Math.exp(-age / 30); // Exponential decay over 30 days
      const weight = INTERACTION_WEIGHTS[interaction.type];
      const score = weight * timeDecay;

      scores.set(
        interaction.spiritId,
        (scores.get(interaction.spiritId) || 0) + score + (interaction.rating ? (interaction.rating / 5) * 2 : 0)
      );

      // We need to map spiritId (UUID) back to its main category for diversity
      let mainCategory = '';
      if (interaction.spiritType === 'alcohol_type') {
        mainCategory = interaction.spiritId; // AlcoholType ID is its own category
      } else if (interaction.spiritType === 'subtype') {
        // Use optional chaining for 'subtypes' array to prevent forEach error
        const subtype = subtypes?.find(s => s.id === interaction.spiritId);
        mainCategory = subtype?.alcohol_type_id || ''; // Get parent alcohol_type_id
      } else if (interaction.spiritType === 'brand') {
        // Use optional chaining for 'brands' and 'subtypes' arrays
        const brand = brands?.find(b => b.id === interaction.spiritId);
        const subtype = subtypes?.find(s => s.id === brand?.subtype_id);
        mainCategory = subtype?.alcohol_type_id || ''; // Get parent alcohol_type_id
      }

      if (mainCategory) {
        categoryScores.set(
          mainCategory,
          (categoryScores.get(mainCategory) || 0) + score
        );
      }
    });

    // Create a list of all possible unique spirits (UUIDs) from your loaded data
    const allUniqueSpiritIds: { id: string; type: 'alcohol_type' | 'subtype' | 'brand'; categoryId: string }[] = [];

    // Use nullish coalescing to ensure arrays are empty if undefined/null
    // This is the primary fix for "forEach of undefined" errors
    alcoholTypes?.forEach(at => allUniqueSpiritIds.push({ id: at.id, type: 'alcohol_type', categoryId: at.id }));
    subtypes?.forEach(st => allUniqueSpiritIds.push({ id: st.id, type: 'subtype', categoryId: st.alcohol_type_id }));
    brands?.forEach(b => {
      const subtype = subtypes?.find(s => s.id === b.subtype_id); // Optional chaining here too
      allUniqueSpiritIds.push({ id: b.id, type: 'brand', categoryId: subtype?.alcohol_type_id || '' });
    });

    console.log("RecommendationsContext: All unique spirit IDs collected. Count:", allUniqueSpiritIds.length); // Debug log
    if (allUniqueSpiritIds.length === 0) {
      console.warn("RecommendationsContext: No unique spirits loaded from SpiritsContext! Check SpiritsContext data."); // Crucial warning
      console.log("SpiritsContext Data - AlcoholTypes length:", alcoholTypes?.length, "Subtypes length:", subtypes?.length, "Brands length:", brands?.length); // Debug log
    }

    // Rank all spirits based on their calculated score (default 0 if not interacted with)
    const rankedSpiritIds = allUniqueSpiritIds
      .map(spirit => ({
        id: spirit.id,
        type: spirit.type,
        categoryId: spirit.categoryId,
        score: scores.get(spirit.id) || 0,
        categoryScore: categoryScores.get(spirit.categoryId) || 0 // Add category score for diversity
      }))
      .sort((a, b) => b.score - a.score); // Sort by individual spirit score

    console.log("RecommendationsContext: calculateSpiritScores - Ranked spirits count:", rankedSpiritIds.length); // Debug log
    return rankedSpiritIds;
  }, [interactions, alcoholTypes, subtypes, brands]); // Dependencies: interactions and all spirit data from SpiritsContext

  // Step 2: Select top recommendations (UUIDs) with diversity
  const selectTopRecommendations = useCallback((rankedSpiritIds: ReturnType<typeof calculateSpiritScores>) => {
    const recommendations: string[] = []; // Will store UUIDs
    const usedCategories = new Set<string>(); // For diversity

    console.log("RecommendationsContext: Starting selectTopRecommendations."); // Debug log
    // Prioritize spirits with high individual scores, ensuring category diversity
    for (const spirit of rankedSpiritIds) {
        if (recommendations.length >= RECOMMENDATION_COUNT) break;

        // Try to add spirits from new categories first
        if (!usedCategories.has(spirit.categoryId)) {
            recommendations.push(spirit.id);
            usedCategories.add(spirit.categoryId);
        }
    }

    // Fill remaining slots with highest-scored spirits, regardless of category diversity
    for (const spirit of rankedSpiritIds) {
        if (recommendations.length >= RECOMMENDATION_COUNT) break;
        if (!recommendations.includes(spirit.id)) { // Avoid duplicates
            recommendations.push(spirit.id);
        }
    }

    // If still not enough, fill with random spirits from existing pool (ensure they are actual UUIDs)
    if (recommendations.length < RECOMMENDATION_COUNT) {
        const remainingSpirits = rankedSpiritIds
            .filter(s => !recommendations.includes(s.id))
            .sort(() => Math.random() - 0.5); // Randomize remaining

        for (const spirit of remainingSpirits) {
            if (recommendations.length >= RECOMMENDATION_COUNT) break;
            recommendations.push(spirit.id);
        }
    }
    console.log("RecommendationsContext: selectTopRecommendations - Top IDs selected:", recommendations); // Debug log
    return recommendations; // Return UUIDs
  }, []);

  // Step 3: Fetch full spirit details for the recommended UUIDs
  const fetchRecommendedSpiritDetails = useCallback(async (ids: string[]) => {
    console.log("RecommendationsContext: Starting fetchRecommendedSpiritDetails for IDs:", ids); // Debug log
    const fetchedDetails: RecommendedSpiritItem[] = [];
    const fetchPromises = ids.map(async id => {
      // Try to find the spirit by ID across all types
      let spirit: AlcoholType | Subtype | Brand | undefined;
      let type: RecommendedSpiritItem['type'] | undefined;

      // Prioritize brand, then subtype, then alcohol type for details
      spirit = brands?.find(b => b.id === id); // Optional chaining
      if (spirit) { type = 'brand'; }
      else {
        spirit = subtypes?.find(s => s.id === id); // Optional chaining
        if (spirit) { type = 'subtype'; }
        else {
          spirit = alcoholTypes?.find(at => at.id === id); // Optional chaining
          if (spirit) { type = 'alcohol_type'; }
        }
      }

      if (spirit && type) {
        fetchedDetails.push({
          id: spirit.id,
          name: spirit.name,
          // Assuming 'image' exists on all these types, or provide a fallback
          image: (spirit as any).image || 'https://via.placeholder.com/150.png?text=Spirit',
          type: type,
        });
      } else {
        console.warn(`RecommendationsContext: Could not find details for recommended spirit ID: ${id}.`); // Debug warn
      }
    });

    await Promise.all(fetchPromises);
    console.log("RecommendationsContext: fetchRecommendedSpiritDetails - Full details count:", fetchedDetails.length); // Debug log
    console.log("RecommendationsContext: Final recommended spirits:", fetchedDetails); // Debug log
    return fetchedDetails;
  }, [alcoholTypes, subtypes, brands]); // Dependencies: all spirit data from SpiritsContext

  // --- Main Effect for Recommendation Update ---
  const debouncedUpdateRecommendations = useCallback(
    debounce(async () => {
      console.log("RecommendationsContext: debouncedUpdateRecommendations triggered."); // Debug log

      // Ensure SpiritsContext data is loaded before calculating/fetching recommendations
      if (spiritsContextLoading || spiritsContextError) {
        console.log("RecommendationsContext: SpiritsContext still loading or error, deferring recommendations.", { spiritsContextLoading, spiritsContextError }); // Debug log
        setIsLoading(true); // Keep loading if SpiritsContext isn't ready
        return;
      }
      setIsLoading(true); // Start loading for recommendations

      const ranked = calculateSpiritScores();
      const topIds = selectTopRecommendations(ranked);
      setRecommendedSpiritIds(topIds); // Update intermediate state with UUIDs

      const fullDetails = await fetchRecommendedSpiritDetails(topIds);
      setRecommendedSpirits(fullDetails); // Update final state with full objects
      setIsLoading(false);
      console.log("RecommendationsContext: Recommendations update complete."); // Debug log
    }, 500),
    [calculateSpiritScores, selectTopRecommendations, fetchRecommendedSpiritDetails, spiritsContextLoading, spiritsContextError]
  );

  // Trigger recommendation update when interactions or core spirit data changes
  useEffect(() => {
    console.log("RecommendationsContext: Main useEffect for updates triggered. isLoading:", isLoading, "spiritsContextLoading:", spiritsContextLoading, "spiritsContextError:", spiritsContextError, "interactions count:", interactions.length); // Debug log
    // Only run if the initial interaction loading is done and core spirit data is ready
    if (!isLoading && !spiritsContextLoading && !spiritsContextError) {
      debouncedUpdateRecommendations();
    }
  }, [interactions, isLoading, spiritsContextLoading, spiritsContextError, debouncedUpdateRecommendations]);


  // --- Interaction Tracking ---
  const trackInteraction = useCallback(
    (
      spiritId: string, // Now expects a UUID
      spiritType: Interaction['spiritType'], // Now expects the type
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
        const newInteractions = [
          newInteraction,
          ...prev
        ].slice(0, MAX_INTERACTIONS);

        console.log("RecommendationsContext: trackInteraction called.", newInteraction); // Debug log
        return newInteractions;
      });

      // Recommendations will be updated by the useEffect above
    },
    [] // No external dependencies for this function's logic
  );

  const clearInteractionHistory = useCallback(() => {
    setInteractions([]);
    setRecommendedSpiritIds([]);
    setRecommendedSpirits([]);
    console.log("RecommendationsContext: Interaction history cleared."); // Debug log
  }, []);

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