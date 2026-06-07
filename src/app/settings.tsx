import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { signOut } from '@/services/auth';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function Settings() {
  const logout = async () => { await signOut(); router.replace('/auth'); };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: Spacing.lg, gap: Spacing.md }}>
      <Row label="Edit profile" onPress={() => {}} />
      <Row label="Notifications" onPress={() => {}} />
      <Row label="Privacy" onPress={() => {}} />
      <Row label="Wallet & credits" onPress={() => {}} />
      <Row label="Sign out" danger onPress={logout} />
    </View>
  );
}

function Row({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={[Typography.body, danger && { color: Colors.danger }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { padding: Spacing.lg, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border },
});
