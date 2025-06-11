import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Running in offline mode.');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (first 5 chars):', supabaseKey ? supabaseKey.substring(0, 5) : 'N/A');

// Create client with error handling
export const supabase = supabaseUrl && supabaseKey 
  ? createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Disable session persistence to avoid auth errors
        autoRefreshToken: false,
      },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }).catch(error => {
            console.warn('Supabase fetch failed:', error.message);
            // Return a mock response to prevent crashes
            return new Response(JSON.stringify({ error: 'Network unavailable' }), {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            });
          });
        }
      }
    })
  : null;

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