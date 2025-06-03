import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es' | 'fr';
export type PreferredSpirit = 'whiskey' | 'gin' | 'rum' | 'tequila' | 'brandy' | 'cognac' | null;

interface UserPreferences {
  theme: Theme;
  language: Language;
  preferredSpirit: PreferredSpirit;
}

interface UserPreferencesContextType extends UserPreferences {
  updatePreferences: (preferences: UserPreferences) => void;
}

const STORAGE_KEY = 'spiritsage_preferences';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  preferredSpirit: null,
};

const loadStoredPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedPreferences = JSON.parse(stored);
      return { ...defaultPreferences, ...parsedPreferences };
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
    toast.error('Failed to load preferences');
  }
  return defaultPreferences;
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const storedPreferences = loadStoredPreferences();
    setPreferences(storedPreferences);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(storedPreferences.theme);
    
    setIsLoading(false);
  }, []);

  const updatePreferences = (newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newPreferences.theme);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <UserPreferencesContext.Provider value={{ ...preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};