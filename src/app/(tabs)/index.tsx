import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FeedCard } from '@/components/FeedCard';
import { UserCard } from '@/components/UserCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { fetchFeed, fetchProfilesByIds } from '@/services/feed';
import type { Post, Profile } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const TABS = ['For you', 'Following', 'Trending'] as const;

export default function HomeScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<typeof TABS[number]>('For you');
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await fetchFeed();
    setPosts(data);
    const map = await fetchProfilesByIds([...new Set(data.map(p => p.user_id))]);
    setAuthors(map);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
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
            posts.slice(0, 8).map(post => (
              <FeedCard key={post.id} post={post} author={authors[post.user_id]} />
            ))
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
});
