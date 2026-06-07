import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { UserCard } from '@/components/UserCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { listDMThreads } from '@/services/dms';
import { fetchProfilesByIds } from '@/services/feed';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types';

export default function DMsScreen() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    listDMThreads(user.id).then(async (rows) => {
      // Group by other user
      const map = new Map<string, any>();
      rows.forEach((m: any) => {
        const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
        if (!map.has(other) || new Date(m.created_at) > new Date(map.get(other).created_at)) map.set(other, { ...m, other });
      });
      const list = Array.from(map.values());
      setThreads(list);
      const profs = await fetchProfilesByIds(list.map(t => t.other));
      setProfiles(profs);
    }).finally(() => setLoading(false));
  }, [user]);

  const filtered = threads.filter(t => {
    if (!q) return true;
    const p = profiles[t.other];
    return p?.name?.toLowerCase().includes(q.toLowerCase()) || p?.username?.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <Header title="Messages" />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: 100 }}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search chats" />
        {loading ? <LoadingState />
          : filtered.length === 0 ? <EmptyState title="No conversations" message="Start a chat from someone's profile." />
          : filtered.map(t => {
              const p = profiles[t.other];
              if (!p) return null;
              return (
                <View key={t.other} style={{ position: 'relative' }}>
                  <UserCard
                    profile={p}
                    subtitle={t.content || 'Tap to chat'}
                    online={!!t.online}
                    onPress={() => router.push(`/dm/${t.other}`)}
                    trailing={t.unread_count ? (
                      <View style={styles.badge}><Text style={styles.badgeText}>{t.unread_count}</Text></View>
                    ) : null}
                  />
                </View>
              );
            })
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: { minWidth: 22, height: 22, paddingHorizontal: 6, borderRadius: Radius.pill, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 11 },
});
