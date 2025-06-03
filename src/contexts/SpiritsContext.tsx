import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export interface SpiritRating {
  id: string;
  spiritId: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TastingNote {
  term: string;
  count: number;
  percentage: number;
}

interface SpiritsContextType {
  ratings: SpiritRating[];
  addRating: (spiritId: string, rating: number, comment: string) => void;
  updateRating: (ratingId: string, rating: number, comment: string) => void;
  deleteRating: (ratingId: string) => void;
  getRatingsForSpirit: (spiritId: string) => SpiritRating[];
  getUserRatingForSpirit: (spiritId: string) => SpiritRating | undefined;
  getTastingNotesForSpirit: (spiritId: string) => TastingNote[];
}

const STORAGE_KEY = 'spiritsage_ratings';
const MOCK_USER_ID = 'current-user';

// Common tasting note terms to look for in reviews
const TASTING_TERMS = [
  // Primary Flavors
  'sweet', 'bitter', 'sour', 'spicy', 'smooth', 'harsh',
  // Vanilla & Caramel Notes
  'vanilla', 'caramel', 'toffee', 'butterscotch', 'honey', 'maple',
  // Fruit Notes
  'fruity', 'citrus', 'apple', 'berry', 'cherry', 'orange', 'lemon', 'tropical',
  // Floral & Herbal
  'floral', 'herbal', 'botanical', 'grassy', 'fresh',
  // Wood & Smoke
  'oak', 'woody', 'smoky', 'peaty', 'charred', 'toasted',
  // Earth & Spice
  'earthy', 'pepper', 'cinnamon', 'nutmeg', 'ginger', 'clove',
  // Other Flavors
  'chocolate', 'coffee', 'nutty', 'leather', 'tobacco',
  // Texture/Body
  'creamy', 'silky', 'rich', 'light', 'heavy', 'thick',
  'oily', 'dry', 'crisp', 'clean', 'balanced', 'complex',
  // Character
  'bold', 'subtle', 'intense', 'mild', 'sharp', 'mellow',
  'warm', 'cool', 'bright', 'dark', 'robust', 'delicate'
];

const SpiritsContext = createContext<SpiritsContextType | undefined>(undefined);

export const SpiritsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ratings, setRatings] = useState<SpiritRating[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRatings(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading ratings:', error);
        toast.error('Failed to load ratings');
      }
    }
  }, []);

  const saveRatings = (newRatings: SpiritRating[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRatings));
      setRatings(newRatings);
    } catch (error) {
      console.error('Error saving ratings:', error);
      toast.error('Failed to save ratings');
      throw error;
    }
  };

  const addRating = (spiritId: string, rating: number, comment: string) => {
    const newRating: SpiritRating = {
      id: crypto.randomUUID(),
      spiritId,
      rating,
      comment,
      userId: MOCK_USER_ID,
      createdAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''),
      updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')
    };

    const existingRating = ratings.find(r => r.spiritId === spiritId && r.userId === MOCK_USER_ID);
    if (existingRating) {
      const updatedRatings = ratings.map(r => 
        r.id === existingRating.id ? newRating : r
      );
      saveRatings(updatedRatings);
    } else {
      saveRatings([...ratings, newRating]);
    }
  };

  const updateRating = (ratingId: string, rating: number, comment: string) => {
    const updatedRatings = ratings.map(r => 
      r.id === ratingId
        ? {
            ...r,
            rating,
            comment,
            updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')
          }
        : r
    );
    saveRatings(updatedRatings);
  };

  const deleteRating = (ratingId: string) => {
    const updatedRatings = ratings.filter(r => r.id !== ratingId);
    saveRatings(updatedRatings);
  };

  const getRatingsForSpirit = (spiritId: string) => {
    return ratings.filter(r => r.spiritId === spiritId);
  };

  const getUserRatingForSpirit = (spiritId: string) => {
    return ratings.find(r => r.spiritId === spiritId && r.userId === MOCK_USER_ID);
  };

  const getTastingNotesForSpirit = (spiritId: string): TastingNote[] => {
    const spiritRatings = getRatingsForSpirit(spiritId);
    if (spiritRatings.length === 0) return [];

    // Count occurrences of tasting terms
    const termCounts = new Map<string, number>();
    
    spiritRatings.forEach(rating => {
      const words = rating.comment.toLowerCase().split(/\W+/);
      const uniqueTermsInReview = new Set<string>();

      words.forEach(word => {
        if (TASTING_TERMS.includes(word) && !uniqueTermsInReview.has(word)) {
          uniqueTermsInReview.add(word);
          termCounts.set(word, (termCounts.get(word) || 0) + 1);
        }
      });
    });

    // Convert to array and calculate percentages
    const tastingNotes: TastingNote[] = Array.from(termCounts.entries())
      .map(([term, count]) => ({
        term,
        count,
        percentage: Math.round((count / spiritRatings.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    return tastingNotes;
  };

  return (
    <SpiritsContext.Provider value={{
      ratings,
      addRating,
      updateRating,
      deleteRating,
      getRatingsForSpirit,
      getUserRatingForSpirit,
      getTastingNotesForSpirit
    }}>
      {children}
    </SpiritsContext.Provider>
  );
};

export const useSpirits = () => {
  const context = useContext(SpiritsContext);
  if (!context) {
    throw new Error('useSpirits must be used within a SpiritsProvider');
  }
  return context;
};