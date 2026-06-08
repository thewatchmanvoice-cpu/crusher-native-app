import getSupabase from '@/lib/supabase';
import type { Notification } from '@/types';

export async function listNotifications(userId: string): Promise<Notification[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as Notification[];
}

export async function markAllRead(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null);
}
