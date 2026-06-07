import { supabase } from '@/lib/supabase';

export async function listDMThreads(userId: string) {
  // Placeholder mapping over private_messages; adjust if RPC exists.
  const { data, error } = await supabase
    .from('private_messages')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function fetchMessages(threadKey: string) {
  const { data, error } = await supabase
    .from('private_messages')
    .select('*')
    .eq('thread_id', threadKey)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function sendMessage(threadId: string, senderId: string, recipientId: string, content: string) {
  const { data, error } = await supabase
    .from('private_messages')
    .insert({ thread_id: threadId, sender_id: senderId, recipient_id: recipientId, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createOrGetChat(otherUserId: string) {
  // Calls existing edge function — does NOT change backend
  const { data, error } = await supabase.functions.invoke('create-or-get-chat', {
    body: { other_user_id: otherUserId },
  });
  if (error) throw error;
  return data;
}
