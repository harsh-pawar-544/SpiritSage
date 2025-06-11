import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
// Removed: import AsyncStorage from '@react-native-async-storage/async-storage'; // No longer needed for manual session management here

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
          // If there's an error getting initial session, ensure user/session are null
          setUser(null);
          setSession(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false); // Set loading to false once initial session check is complete
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => { // Renamed 'session' to 'currentSession' for clarity
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // --- REMOVED MANUAL ASYNCSTORAGE OPERATIONS ---
        // Supabase client automatically handles storing and retrieving sessions
        // when configured with `storage: AsyncStorage` in createClient.
        // if (currentSession?.user) {
        //   await AsyncStorage.setItem('userSession', JSON.stringify(currentSession));
        // } else {
        //   await AsyncStorage.removeItem('userSession');
        // }

        // Decide if you want to set loading to false here.
        // Typically, `loading` is for the initial state check.
        // State changes from login/logout/refresh are handled by `setSession` and `setUser`.
        // If you keep setLoading(false) here, it might make UI flicker if many auth changes fire.
        // For persistence across refreshes, `getInitialSession` and `onAuthStateChange` (without manual storage) is the key.
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array, runs once on component mount.

  const signUp = async (email: string, password: string) => {
    setLoading(true); // Set loading state for the operation
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      // The onAuthStateChange listener will automatically update user/session state
      return { error };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true); // Set loading state for the operation
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // The onAuthStateChange listener will automatically update user/session state
      return { error };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const signOut = async () => {
    setLoading(true); // Set loading state for the operation
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // --- REMOVED DANGEROUS AsyncStorage.clear() ---
      // supabase.auth.signOut() handles clearing its own session data in AsyncStorage.
      // Calling AsyncStorage.clear() here would clear ALL app data and cause persistence issues.

      // Manually clear local state immediately for faster UI updates after sign out
      setUser(null);
      setSession(null);

    } catch (error) {
      throw error;
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      const err = error as Error;
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};