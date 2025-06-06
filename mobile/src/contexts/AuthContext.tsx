import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CrashReportingService from '../services/CrashReportingService';
import AnalyticsService from '../services/AnalyticsService';

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
          console.error('Error getting session:', error);
          CrashReportingService.captureException(new Error(error.message));
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Set user context for analytics and crash reporting
            const userInfo = {
              id: session.user.id,
              email: session.user.email,
            };
            AnalyticsService.identify(session.user.id, userInfo);
            CrashReportingService.setUser(userInfo);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        CrashReportingService.captureException(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Store user session locally
          await AsyncStorage.setItem('userSession', JSON.stringify(session));
          
          // Update analytics and crash reporting
          const userInfo = {
            id: session.user.id,
            email: session.user.email,
          };
          AnalyticsService.identify(session.user.id, userInfo);
          CrashReportingService.setUser(userInfo);
          
          // Track sign in
          if (event === 'SIGNED_IN') {
            AnalyticsService.track('User Signed In');
          }
        } else {
          // Clear stored session
          await AsyncStorage.removeItem('userSession');
          
          // Track sign out
          if (event === 'SIGNED_OUT') {
            AnalyticsService.track('User Signed Out');
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        CrashReportingService.captureException(new Error(error.message));
      } else {
        AnalyticsService.track('User Signed Up', { email });
      }

      return { error };
    } catch (error) {
      const err = error as Error;
      CrashReportingService.captureException(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        CrashReportingService.captureException(new Error(error.message));
      }

      return { error };
    } catch (error) {
      const err = error as Error;
      CrashReportingService.captureException(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        CrashReportingService.captureException(new Error(error.message));
        throw error;
      }
      
      // Clear local storage
      await AsyncStorage.clear();
    } catch (error) {
      CrashReportingService.captureException(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        CrashReportingService.captureException(new Error(error.message));
      } else {
        AnalyticsService.track('Password Reset Requested', { email });
      }

      return { error };
    } catch (error) {
      const err = error as Error;
      CrashReportingService.captureException(err);
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