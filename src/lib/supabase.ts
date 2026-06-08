import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (Constants.expoConfig?.extra as any)?.supabaseUrl;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] Missing EXPO_PUBLIC_SUPABASE_URL / ANON_KEY');
}

// Avoid creating the Supabase client during Node/server-side rendering
// because the GoTrue client reads `window` / localStorage internally.
// Create the client lazily on the client runtime only.
let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  if (typeof window === 'undefined') {
    // Server environment: do not initialize the client.
    return null;
  }

  _supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return _supabase;
}

export default getSupabase;
