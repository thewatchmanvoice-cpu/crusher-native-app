import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Profile } from '@/types';

interface Stats { posts: number; followers: number; following: number; }
interface Props { profile: Profile; stats: Stats; onEdit?: () => void; onSettings?: () => void; }

export function ProfileHeader({ profile, stats, onEdit, onSettings }: Props) {
  const initials = (profile.name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: Colors.primary, fontSize: 28, fontWeight: '700' }}>{initials}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
          <Settings size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <Text style={[Typography.h2, { marginTop: Spacing.md }]}>{profile.name}</Text>
      {profile.username && <Text style={Typography.caption}>@{profile.username}</Text>}
      {profile.bio && <Text style={[Typography.body, { marginTop: Spacing.sm }]}>{profile.bio}</Text>}

      <View style={styles.statsRow}>
        <Stat label="Posts" value={stats.posts} />
        <Stat label="Followers" value={stats.followers} />
        <Stat label="Following" value={stats.following} />
      </View>

      <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Edit profile</Text>
      </TouchableOpacity>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={Typography.h3}>{value}</Text>
      <Text style={Typography.small}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  avatar: { width: 88, height: 88, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginTop: Spacing.lg, paddingVertical: Spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
  editBtn: { marginTop: Spacing.lg, backgroundColor: Colors.primary, paddingVertical: Spacing.md, borderRadius: Radius.lg, alignItems: 'center' },
});
