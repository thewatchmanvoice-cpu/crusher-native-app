import getSupabase from '@/lib/supabase';
import type { Post, PostComment, PostLike, PostReaction, Profile } from '@/types';

export async function fetchPostById(postId: string): Promise<{ post: Post | null; author: Profile | null }> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');

  const sb = supabase as any;
  const { data: post, error: postError } = await sb
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();
  if (postError) throw postError;
  if (!post) return { post: null, author: null };

  const { data: profile, error: profileError } = await sb
    .from('profiles')
    .select('id,user_id,name,username,avatar_url,bio')
    .eq('user_id', post.user_id)
    .single();
  if (profileError) throw profileError;

  return { post: post as Post, author: profile as Profile | null };
}

export async function fetchPostComments(postId: string): Promise<PostComment[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');

  const sb = supabase as any;
  const { data, error } = await sb
    .from('post_comments')
    .select('id,post_id,user_id,content,created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const comments = (data || []) as PostComment[];
  const userIds = [...new Set(comments.map(comment => comment.user_id))];
  if (!userIds.length) return comments;

  const { data: profiles, error: profileError } = await sb
    .from('profiles')
    .select('id,user_id,name,username,avatar_url,bio')
    .in('user_id', userIds);
  if (profileError) throw profileError;

  const profileMap: Record<string, Profile> = {};
  (profiles || []).forEach((profile: any) => {
    profileMap[profile.user_id] = profile;
  });

  return comments.map(comment => ({
    ...comment,
    author: profileMap[comment.user_id] || null,
  }));
}

export async function fetchPostLikes(postId: string): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { data, error } = await sb
    .from('post_likes')
    .select('id', { count: 'exact', head: false })
    .eq('post_id', postId);
  if (error) throw error;

  return data?.length ?? 0;
}

export async function fetchPostLikeByUser(postId: string, userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { data, error } = await sb
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;

  return !!data;
}

export async function fetchPostReactions(postId: string): Promise<Record<string, number>> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { data, error } = await sb
    .from('post_reactions')
    .select('reaction')
    .eq('post_id', postId);
  if (error) throw error;

  const reactions: Record<string, number> = {};
  (data || []).forEach((reaction: any) => {
    const type = reaction.reaction || 'unknown';
    reactions[type] = (reactions[type] || 0) + 1;
  });

  return reactions;
}

export async function addCommentToPost(postId: string, userId: string, content: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { data, error } = await sb
    .from('post_comments')
    .insert({ post_id: postId, user_id: userId, content })
    .select()
    .single();
  if (error) throw error;

  // Fetch the author profile for this comment
  const { data: profile, error: profileError } = await sb
    .from('profiles')
    .select('id,user_id,name,username,avatar_url,bio')
    .eq('user_id', userId)
    .single();
  if (profileError) console.warn('Could not fetch profile:', profileError);

  return { ...data, author: profile || null } as PostComment;
}

export async function addReactionToPost(postId: string, userId: string, reactionType: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { data, error } = await sb
    .from('post_reactions')
    .insert({ post_id: postId, user_id: userId, reaction: reactionType })
    .select()
    .single();
  if (error) throw error;

  return data as PostReaction;
}

export async function likePost(postId: string, userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  // Check if already liked to avoid duplicate constraint error
  const { data: existing, error: checkError } = await sb
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking existing like:', checkError);
    throw checkError;
  }

  if (existing) {
    console.log('Already liked this post');
    return existing as PostLike;
  }

  const { data, error } = await sb
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding like:', error);
    throw error;
  }

  console.log('Like added successfully:', data);
  return data as PostLike;
}

export async function unlikePost(postId: string, userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not available');
  const sb = supabase as any;

  const { error } = await sb
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  if (error) throw error;
}
