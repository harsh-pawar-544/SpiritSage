import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features may not work properly.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchRatingsForSpirit(spiritId: string) {
  // Mock API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          spirit_id: spiritId,
          user_id: 'mock-user-123',
          rating: 5,
          comment: 'Excellent spirit with complex flavors',
          created_at: new Date().toISOString(),
          user_name: 'John Doe'
        }
      ]);
    }, 500);
  });
}