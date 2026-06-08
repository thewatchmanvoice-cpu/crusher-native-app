import { EmptyState } from '@/components/EmptyState';
import { FeedCard } from '@/components/FeedCard';
import { Header } from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import { SearchBar } from '@/components/SearchBar';
import { UserCard } from '@/components/UserCard';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { fetchFeed, fetchProfilesByIds } from '@/services/feed';
import { fetchPostLikeByUser, fetchPostLikes, likePost, unlikePost } from '@/services/posts';
import type { Post, Profile } from '@/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['For you', 'Following', 'Trending'] as const;
const PAGE_SIZE = 15;

interface PostWithLikes extends Post {
  likeCount: number;
  isLiked: boolean;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<typeof TABS[number]>('For you');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<PostWithLikes[]>([]);
  const [authors, setAuthors] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const load = async (newOffset = 0) => {
    try {
      const data = await fetchFeed(undefined, undefined, newOffset);
      
      // Fetch likes info for all posts
      const postsWithLikes = await Promise.all(
        data.map(async (post) => {
          try {
            const [likeCount, isLiked] = await Promise.all([
              fetchPostLikes(post.id),
              user ? fetchPostLikeByUser(post.id, user.id) : Promise.resolve(false),
            ]);
            return { ...post, likeCount, isLiked };
          } catch (err) {
            console.error('Error fetching likes for post:', err);
            return { ...post, likeCount: 0, isLiked: false };
          }
        })
      );

      if (newOffset === 0) {
        setPosts(postsWithLikes);
      } else {
        setPosts(prev => [...prev, ...postsWithLikes]);
      }
      
      const map = await fetchProfilesByIds([...new Set(data.map(p => p.user_id))]);
      setAuthors(prev => ({ ...prev, ...map }));
      setOffset(newOffset + PAGE_SIZE);
    } catch (error: any) {
      console.error('Error loading feed:', error);
      Alert.alert('Error', error?.message || 'Unable to load posts');
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setOffset(0);
    await load(0);
    setRefreshing(false);
  };

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      await load(offset);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFeedLike = async (postId: string) => {
    if (!user) {
      Alert.alert('Login required', 'Please sign in to like posts.');
      return;
    }

    // Find the post
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];

    try {
      if (post.isLiked) {
        await unlikePost(postId, user.id);
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, isLiked: false, likeCount: Math.max(0, p.likeCount - 1) }
              : p
          )
        );
      } else {
        await likePost(postId, user.id);
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, isLiked: true, likeCount: p.likeCount + 1 }
              : p
          )
        );
      }
    } catch (error: any) {
      console.error('Error updating like:', error);
      Alert.alert('Unable to update like', error?.message || 'Please try again.');
    }
  };

  const handleFeedShare = async (postId: string) => {
    try {
      await Share.share({ message: `https://crushr.com/post/${postId}` });
    } catch (error: any) {
      if (error?.message) Alert.alert('Unable to share', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <Header onSearch={() => {}} onNotifications={() => router.push('/notifications')} />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search Crushr" />

        <TouchableOpacity onPress={() => router.push('/compose')} style={styles.composer}>
          <Text style={Typography.caption}>What's on your mind?</Text>
        </TouchableOpacity>

        <View style={styles.tabs}>
          {TABS.map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[Typography.caption, tab === t && { color: Colors.primary, fontWeight: '700' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Section title="Suggested for you">
          {Object.values(authors).slice(0, 3).map(p => (
            <UserCard key={p.user_id} profile={p} subtitle={p.bio || '@' + (p.username || 'user')} onPress={() => router.push(`/user/${p.user_id}`)} />
          ))}
        </Section>

        <Section title="Trending now">
          {loading ? <LoadingState /> :
            posts.length === 0 ? <EmptyState title="No posts yet" message="Follow people to see their posts." /> :
            <>
              {posts.map(post => (
                <FeedCard
                  key={post.id}
                  post={post}
                  author={authors[post.user_id]}
                  onPress={() => router.push(`/post/${post.id}`)}
                  onComment={() => router.push(`/post/${post.id}`)}
                  onLike={() => handleFeedLike(post.id)}
                  onShare={() => handleFeedShare(post.id)}
                />
              ))}
              <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
                <TouchableOpacity onPress={loadMorePosts} disabled={loadingMore} style={styles.loadMoreButton}>
                  {loadingMore ? (
                    <ActivityIndicator color={Colors.primary} />
                  ) : (
                    <Text style={styles.loadMoreText}>Load More Posts</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          }
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: Spacing.md }}>
      <Text style={Typography.h3}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    padding: Spacing.lg, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  tabs: { flexDirection: 'row', gap: Spacing.sm },
  tab: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  tabActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  loadMoreButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: Colors.primary, borderRadius: Radius.lg, minWidth: 150, alignItems: 'center' },
  loadMoreText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
