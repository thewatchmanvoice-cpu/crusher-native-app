import getSupabase from '@/lib/supabase';
import type { Chatroom } from '@/types';

export async function listChatrooms(): Promise<Chatroom[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { data, error } = await supabase
    .from('chatrooms')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []) as Chatroom[];
}

export async function joinRoom(roomId: string, userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { error } = await supabase
    .from('chatroom_members')
    .insert({ chatroom_id: roomId, user_id: userId });
  if (error && !String(error.message).includes('duplicate')) throw error;
}

export async function fetchRoomMessages(roomId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const { data, error } = await supabase
    .from('chatroom_messages')
    .select('*')
    .eq('chatroom_id', roomId)
    .order('created_at', { ascending: true })
    .limit(100);
  if (error) throw error;
  return data || [];
}
