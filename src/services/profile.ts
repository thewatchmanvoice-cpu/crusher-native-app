import getSupabase from '@/lib/supabase';
import type { Profile } from '@/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile) || null;
}

export async function updateProfile(userId: string, patch: Partial<Profile>) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { error } = await supabase.from('profiles').update(patch).eq('user_id', userId);
  if (error) throw error;
}

export async function getStats(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const [{ count: msgCount }, { count: postsCount }, { count: followersCount }, { count: followingCount }] =
    await Promise.all([
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', userId),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    ]);
  return {
    messages: msgCount || 0,
    posts: postsCount || 0,
    followers: followersCount || 0,
    following: followingCount || 0,
  };
}
