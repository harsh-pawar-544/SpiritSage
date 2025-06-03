import React, { createContext, useContext, ReactNode, useState } from 'react';
import { UserPreferencesProvider } from './UserPreferencesContext';

// Define the context type
type SpiritSageContextType = {
  isInitialized: boolean;
};

// Create the context with a default value
const SpiritSageContext = createContext<SpiritSageContextType | undefined>(undefined);

// Define the props for the provider component
type SpiritSageProviderProps = {
  children: ReactNode;
};

// Create the provider component
export const SpiritSageProvider: React.FC<SpiritSageProviderProps> = ({ children }) => {
  // Add your state and functions here
  const [isInitialized] = useState(true);

  // The value that will be provided to consumers of this context
  const value = {
    isInitialized,
    // Add more state and functions as needed
  };

  return (
    <SpiritSageContext.Provider value={value}>
      <UserPreferencesProvider>
        {children}
      </UserPreferencesProvider>
    </SpiritSageContext.Provider>
  );
};

// Custom hook to use the context
export const useSpiritSage = (): SpiritSageContextType => {
  const context = useContext(SpiritSageContext);
  if (context === undefined) {
    throw new Error('useSpiritSage must be used within a SpiritSageProvider');
  }
  return context;
};