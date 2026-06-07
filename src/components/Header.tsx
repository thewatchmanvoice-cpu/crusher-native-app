import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface Props {
  title?: string;
  onSearch?: () => void;
  onNotifications?: () => void;
  unread?: number;
}

export function Header({ title = 'Crushr', onSearch, onNotifications, unread = 0 }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.logo}>{title}</Text>
      <View style={styles.actions}>
        {onSearch && (
          <TouchableOpacity onPress={onSearch} style={styles.iconBtn}>
            <Search size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
        {onNotifications && (
          <TouchableOpacity onPress={onNotifications} style={styles.iconBtn}>
            <Bell size={20} color={Colors.text} />
            {unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: { ...Typography.h2, color: Colors.primary, letterSpacing: -0.5 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 40, height: 40, borderRadius: Radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  badge: {
    position: 'absolute', top: 4, right: 4,
    minWidth: 16, height: 16, paddingHorizontal: 4,
    borderRadius: 8, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
