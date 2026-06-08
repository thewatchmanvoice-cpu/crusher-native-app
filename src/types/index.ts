export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  name: string;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  external_link?: string | null;
  points_balance?: number;
  referral_code?: string;
  created_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface Chatroom {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  member_count?: number;
  status?: 'waitlist' | 'active' | string;
  waitlist_count?: number;
  cover_url?: string | null;
}

export interface DMThread {
  id: string;
  other_user_id: string;
  other_user?: Profile;
  last_message?: string;
  last_at?: string;
  unread_count?: number;
  online?: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body?: string | null;
  read_at?: string | null;
  created_at: string;
}
