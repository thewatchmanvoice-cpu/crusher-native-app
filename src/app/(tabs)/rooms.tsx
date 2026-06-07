import { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { RoomCard } from '@/components/RoomCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { listChatrooms, joinRoom } from '@/services/rooms';
import type { Chatroom } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = ['All', 'Trending', 'New', 'Gaming', 'Music', 'Chill'];

export default function RoomsScreen() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    listChatrooms().then(setRooms).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => rooms.filter(r =>
    (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
    (cat === 'All' || r.category === cat)
  ), [rooms, q, cat]);

  const active = filtered.filter(r => r.status === 'active');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <Header title="Rooms" />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 }}>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search rooms" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c} onPress={() => setCat(c)} style={[styles.chip, cat === c && styles.chipActive]}>
              <Text style={[Typography.caption, cat === c && { color: Colors.primary, fontWeight: '700' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && <LoadingState />}

        {!loading && active.length > 0 && (
          <View style={{ gap: Spacing.md }}>
            <Text style={Typography.h3}>Active rooms</Text>
            {active.map(r => (
              <RoomCard key={r.id} room={r}
                onOpen={() => router.push(`/room/${r.id}`)}
                onJoin={() => user && joinRoom(r.id, user.id)} />
            ))}
          </View>
        )}

        {!loading && (
          <View style={{ gap: Spacing.md }}>
            <Text style={Typography.h3}>All rooms</Text>
            {filtered.length === 0
              ? <EmptyState title="No rooms found" message="Try a different category or search." />
              : filtered.map(r => (
                <RoomCard key={r.id} room={r}
                  onOpen={() => router.push(`/room/${r.id}`)}
                  onJoin={() => user && joinRoom(r.id, user.id)} />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
});
