import getSupabase from '@/lib/supabase';

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available on server');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available on server');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  return data.session;
}
