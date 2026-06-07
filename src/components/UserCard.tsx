import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Profile } from '@/types';

interface Props {
  profile: Profile;
  subtitle?: string;
  online?: boolean;
  trailing?: React.ReactNode;
  onPress?: () => void;
}

export function UserCard({ profile, subtitle, online, trailing, onPress }: Props) {
  const initials = (profile.name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.wrap, Shadow.card]}>
      <View>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        {online && <View style={styles.dot} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={Typography.bodyBold} numberOfLines={1}>{profile.name || profile.username}</Text>
        {subtitle ? <Text style={Typography.caption} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  avatar: { width: 48, height: 48, borderRadius: Radius.pill, backgroundColor: Colors.surfaceAlt },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontWeight: '700' },
  dot: {
    position: 'absolute', right: 0, bottom: 0, width: 12, height: 12,
    borderRadius: 6, backgroundColor: Colors.online, borderWidth: 2, borderColor: Colors.background,
  },
});
