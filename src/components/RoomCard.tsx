import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { Chatroom } from '@/types';

interface Props { room: Chatroom; onJoin?: () => void; onOpen?: () => void; }

export function RoomCard({ room, onJoin, onOpen }: Props) {
  return (
    <TouchableOpacity onPress={onOpen} activeOpacity={0.85} style={[styles.wrap, Shadow.card]}>
      <View style={styles.header}>
        <View style={styles.iconBox}><Users size={20} color={Colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={Typography.bodyBold} numberOfLines={1}>{room.name}</Text>
          {room.category && <Text style={Typography.small}>{room.category}</Text>}
        </View>
        {room.status === 'active' && <View style={styles.liveDot} />}
      </View>
      {room.description && <Text style={[Typography.caption, { marginTop: Spacing.sm }]} numberOfLines={2}>{room.description}</Text>}
      <View style={styles.footer}>
        <Text style={Typography.small}>{room.member_count || 0} members</Text>
        <TouchableOpacity onPress={onJoin} style={styles.joinBtn}>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center' },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.online },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  joinBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill },
  joinText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
