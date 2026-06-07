import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getStats } from '@/services/profile';
import { listNotifications } from '@/services/notifications';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { profile, loading } = useProfile(user?.id);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, messages: 0 });
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    getStats(user.id).then(setStats).catch(() => {});
    listNotifications(user.id).then(n => setUnread(n.filter(x => !x.read_at).length)).catch(() => {});
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <Header title="Dashboard" />
      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 100 }}>
        <View style={[styles.hero, Shadow.card]}>
          <Text style={Typography.caption}>Wallet balance</Text>
          <Text style={[Typography.h1, { color: Colors.primary, marginTop: Spacing.xs }]}>
            {profile?.points_balance ?? 0} credits
          </Text>
          <Text style={Typography.small}>Tap to top up via wallet</Text>
        </View>

        <View style={styles.grid}>
          <StatCard label="Posts" value={stats.posts} />
          <StatCard label="Followers" value={stats.followers} />
          <StatCard label="Following" value={stats.following} />
          <StatCard label="Messages" value={stats.messages} />
        </View>

        <View style={[styles.card, Shadow.card]}>
          <Text style={Typography.h3}>Notifications</Text>
          <Text style={[Typography.caption, { marginTop: Spacing.xs }]}>{unread} unread</Text>
        </View>

        <View style={[styles.card, Shadow.card]}>
          <Text style={Typography.h3}>Account overview</Text>
          <Row label="Name" value={profile?.name || '—'} />
          <Row label="Username" value={profile?.username ? '@' + profile.username : '—'} />
          <Row label="Referral code" value={profile?.referral_code || '—'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={[styles.statCard, Shadow.card]}>
      <Text style={Typography.h2}>{value}</Text>
      <Text style={Typography.small}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={Typography.caption}>{label}</Text>
      <Text style={Typography.bodyBold}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: { flexBasis: '47%', flexGrow: 1, padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
  card: { padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
});
