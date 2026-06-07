import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ProfileHeader } from '@/components/ProfileHeader';
import { FeedCard } from '@/components/FeedCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getStats } from '@/services/profile';
import { fetchFeed } from '@/services/feed';
import { signOut } from '@/services/auth';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Post } from '@/types';

const TABS = ['Posts', 'Followers', 'Following'] as const;

export default function ProfileScreen() {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile(user?.id);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, messages: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<typeof TABS[number]>('Posts');

  useEffect(() => {
    if (!user) return;
    getStats(user.id).then(setStats).catch(() => {});
    fetchFeed(undefined, [user.id]).then(setPosts).catch(() => {});
  }, [user]);

  if (authLoading) return <LoadingState />;

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }}>
        <Text style={Typography.h2}>Sign in to view your profile</Text>
        <TouchableOpacity onPress={() => router.push('/auth')} style={styles.signInBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Sign in</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!profile) return <LoadingState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 }}>
        <ProfileHeader
          profile={profile}
          stats={stats}
          onEdit={() => router.push('/settings')}
          onSettings={() => router.push('/settings')}
        />

        <View style={styles.tabs}>
          {TABS.map(t => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[Typography.caption, tab === t && { color: Colors.primary, fontWeight: '700' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Posts' && (
          posts.length === 0
            ? <EmptyState title="No posts yet" message="Share your first post." />
            : posts.map(p => <FeedCard key={p.id} post={p} author={profile} />)
        )}

        {tab !== 'Posts' && <EmptyState title={tab} message={`Your ${tab.toLowerCase()} will appear here.`} />}

        <TouchableOpacity onPress={() => signOut()} style={styles.signOut}>
          <Text style={{ color: Colors.danger, fontWeight: '700' }}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: Spacing.sm },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  tabActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  signInBtn: { marginTop: Spacing.lg, backgroundColor: Colors.primary, paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md, borderRadius: Radius.lg },
  signOut: { padding: Spacing.lg, alignItems: 'center' },
});
