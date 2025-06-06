import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eiamlzpxbfnllyhzrwrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpYW1senB4YmZubGx5aHpyd3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjY3OTksImV4cCI6MjA2NDQ0Mjc5OX0.1l_wXeEeT3XZ2Kl8O25FLvO15lc9W3jCfQBRokpITc0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});