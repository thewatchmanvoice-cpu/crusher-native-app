import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface Props { title?: string; message?: string; icon?: React.ReactNode; }

export function EmptyState({ title = 'Nothing here yet', message = 'Come back later.', icon }: Props) {
  return (
    <View style={styles.wrap}>
      {icon ?? <Inbox size={42} color={Colors.textSubtle} />}
      <Text style={[Typography.h3, { marginTop: Spacing.md }]}>{title}</Text>
      <Text style={[Typography.caption, { textAlign: 'center', marginTop: Spacing.xs }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: Spacing['3xl'] },
});
