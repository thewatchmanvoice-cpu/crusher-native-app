import { supabase } from '@/lib/supabase';
import type { Post, Profile } from '@/types';

const PAGE = 15;

export async function fetchFeed(beforeISO?: string, userIds?: string[]): Promise<Post[]> {
  let q = supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(PAGE);
  if (userIds?.length) q = q.in('user_id', userIds);
  if (beforeISO) q = q.lt('created_at', beforeISO);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Post[];
}

export async function fetchProfilesByIds(ids: string[]): Promise<Record<string, Profile>> {
  if (!ids.length) return {};
  const { data } = await supabase
    .from('profiles')
    .select('id,user_id,name,username,avatar_url,bio')
    .in('user_id', ids);
  const map: Record<string, Profile> = {};
  (data || []).forEach((p: any) => (map[p.user_id] = p));
  return map;
}

export async function createPost(userId: string, content: string, imageUrl?: string | null) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, content, image_url: imageUrl ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}
