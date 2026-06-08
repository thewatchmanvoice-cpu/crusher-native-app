import getSupabase from '@/lib/supabase';

export async function listDMThreads(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
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

export async function fetchMessages(senderId: string, recipientId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  
  console.log('Fetching messages between:', { senderId, recipientId });
  
  const { data, error } = await supabase
    .from('private_messages')
    .select('*')
    .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  console.log('Messages fetched:', data?.length || 0);
  return data || [];
}

export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  
  console.log('Sending message:', { senderId, recipientId, content });
  
  const { data, error } = await supabase
    .from('private_messages')
    .insert({ sender_id: senderId, recipient_id: recipientId, content })
    .select()
    .single();
  
  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  
  console.log('Message sent successfully:', data);
  return data;
}

export async function createOrGetChat(otherUserId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  // Calls existing edge function — does NOT change backend
  const { data, error } = await supabase.functions.invoke('create-or-get-chat', {
    body: { other_user_id: otherUserId },
  });
  if (error) throw error;
  return data;
}
