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
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setPreferredSpirit: (spirit: PreferredSpirit) => void;
}

const STORAGE_KEY = 'spiritsage_preferences';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  preferredSpirit: null,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    // Load stored preferences
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast.error('Failed to load preferences');
    }
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(preferences.theme);
    
    // Save preferences
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  }, [preferences]);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  const setTheme = (theme: Theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    setPreferences(prev => ({ ...prev, language }));
  };

  const setPreferredSpirit = (preferredSpirit: PreferredSpirit) => {
    setPreferences(prev => ({ ...prev, preferredSpirit }));
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ 
        ...preferences, 
        updatePreferences,
        setTheme,
        setLanguage,
        setPreferredSpirit
      }}
    >
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