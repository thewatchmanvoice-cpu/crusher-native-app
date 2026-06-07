import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { listNotifications, markAllRead } from '@/services/notifications';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Notification } from '@/types';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    listNotifications(user.id).then(setItems).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingState />;
  if (!items.length) return <EmptyState title="No notifications" message="You're all caught up." />;

  return (
    <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}>
      <TouchableOpacity onPress={() => user && markAllRead(user.id).then(() => setItems(items.map(i => ({ ...i, read_at: new Date().toISOString() }))))}>
        <Text style={[Typography.caption, { color: Colors.primary, textAlign: 'right' }]}>Mark all read</Text>
      </TouchableOpacity>
      {items.map(n => (
        <View key={n.id} style={[styles.card, !n.read_at && styles.unread]}>
          <Text style={Typography.bodyBold}>{n.title}</Text>
          {n.body && <Text style={[Typography.caption, { marginTop: Spacing.xs }]}>{n.body}</Text>}
          <Text style={[Typography.small, { marginTop: Spacing.xs }]}>{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  unread: { borderColor: Colors.primary + '55', backgroundColor: Colors.primary + '08' },
});
