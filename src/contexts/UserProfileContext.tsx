import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export interface UserProfile {
  id: string;
  createdAt: string;
  lastActive: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    favoriteSpirits: string[];
  };
}

interface InteractionHistory {
  id: string;
  userId: string;
  spiritId: string;
  type: 'view' | 'favorite' | 'rating';
  rating?: number;
  comment?: string;
  timestamp: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  interactions: InteractionHistory[];
  logInteraction: (spiritId: string, type: InteractionHistory['type'], data?: { rating?: number; comment?: string }) => void;
  getUserHistory: () => InteractionHistory[];
  clearHistory: () => void;
  exportHistory: () => void;
}

const STORAGE_KEY_PROFILE = 'spiritsage_user_profile';
const STORAGE_KEY_INTERACTIONS = 'spiritsage_user_interactions';

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [interactions, setInteractions] = useState<InteractionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize or load existing profile
  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      const storedInteractions = localStorage.getItem(STORAGE_KEY_INTERACTIONS);

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        const newProfile: UserProfile = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          preferences: {
            theme: 'light',
            language: 'en',
            favoriteSpirits: [],
          },
        };
        setProfile(newProfile);
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
      }

      if (storedInteractions) {
        setInteractions(JSON.parse(storedInteractions));
      }

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  // Update last active timestamp
  useEffect(() => {
    const updateLastActive = () => {
      if (profile) {
        const updatedProfile = {
          ...profile,
          lastActive: new Date().toISOString(),
        };
        setProfile(updatedProfile);
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updatedProfile));
      }
    };

    const interval = setInterval(updateLastActive, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [profile]);

  const logInteraction = (
    spiritId: string,
    type: InteractionHistory['type'],
    data?: { rating?: number; comment?: string }
  ) => {
    if (!profile) return;

    const newInteraction: InteractionHistory = {
      id: uuidv4(),
      userId: profile.id,
      spiritId,
      type,
      ...data,
      timestamp: new Date().toISOString(),
    };

    setInteractions(prev => {
      const updated = [newInteraction, ...prev];
      localStorage.setItem(STORAGE_KEY_INTERACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const getUserHistory = () => {
    return interactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const clearHistory = () => {
    setInteractions([]);
    localStorage.setItem(STORAGE_KEY_INTERACTIONS, '[]');
    toast.success('Interaction history cleared');
  };

  const exportHistory = () => {
    const data = {
      profile,
      interactions: getUserHistory(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spiritsage-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('History exported successfully');
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoading,
        interactions,
        logInteraction,
        getUserHistory,
        clearHistory,
        exportHistory,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};