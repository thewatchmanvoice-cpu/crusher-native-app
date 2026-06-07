import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function RoomDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: Spacing.lg }}>
      <Text style={Typography.h2}>Room</Text>
      <Text style={Typography.caption}>id: {id}</Text>
      <EmptyState title="Room view" message="Wire fetchRoomMessages(id) here." />
    </View>
  );
}
