import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { getProfile, getStats } from '@/services/profile';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import type { Profile } from '@/types';

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getProfile(String(id)), getStats(String(id))])
      .then(([p, s]) => { setProfile(p); setStats(s); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!profile) return <EmptyState title="Profile not found" />;

  return (
    <ScrollView contentContainerStyle={{ padding: Spacing.lg, backgroundColor: Colors.background, gap: Spacing.lg }}>
      <ProfileHeader profile={profile} stats={stats} />
    </ScrollView>
  );
}
