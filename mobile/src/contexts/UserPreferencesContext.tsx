import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsedPreferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const setTheme = (theme: Theme) => {
    const newPreferences = { ...preferences, theme };
    updatePreferences(newPreferences);
  };

  const setLanguage = (language: Language) => {
    const newPreferences = { ...preferences, language };
    updatePreferences(newPreferences);
  };

  const setPreferredSpirit = (preferredSpirit: PreferredSpirit) => {
    const newPreferences = { ...preferences, preferredSpirit };
    updatePreferences(newPreferences);
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