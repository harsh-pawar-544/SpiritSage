import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 5 chars):', supabaseKey ? supabaseKey.substring(0, 5) : 'N/A');

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Enable auto token refresh
    detectSessionInUrl: true, // Enable session detection from URL
    storage: window.localStorage, // Use localStorage for session storage
  },
  global: {
    headers: {
      'X-Client-Info': 'spiritsage-web',
    },
  },
});

// Helper function to check if Supabase is available
export const isSupabaseAvailable = async (): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    const { error } = await supabase.from('alcohol_types').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
};