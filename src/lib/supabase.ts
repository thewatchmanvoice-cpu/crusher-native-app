import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export type PublicConfig = {
  onesignal_app_id: string | null;
  socket_server_url: string | null;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function getPublicConfig(): Promise<PublicConfig> {
  const { data, error } = await supabase.functions.invoke<PublicConfig>('get-public-config');

  if (error) {
    throw error;
  }

  return data ?? { onesignal_app_id: null, socket_server_url: null };
}
