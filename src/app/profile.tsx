import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: Spacing.four, paddingBottom: insets.bottom + BottomTabInset }}>
      <ThemedText type="subtitle">Your Profile</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.description}>
        Set up your community profile, discover recommended groups, and keep your presence current.
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.profileCard}>
        <ThemedText type="default" style={styles.profileName}>
          Crushr User
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Member since 2025 Â· Active in 12 communities
        </ThemedText>
      </ThemedView>

      <View style={styles.quickActions}>
        <ThemedView type="backgroundElement" style={styles.actionTile}>
          <ThemedText type="smallBold">Edit profile</ThemedText>
        </ThemedView>
        <ThemedView type="backgroundElement" style={styles.actionTile}>
          <ThemedText type="smallBold">Groups</ThemedText>
        </ThemedView>
      </View>

      <ThemedView type="backgroundElement" style={styles.helpCard}>
        <ThemedText type="smallBold">Native mobile profile</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
          Use this page as a springboard for notifications, account settings, and media uploads.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
  },
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  profileName: {
    marginBottom: Spacing.one,
  },
  quickActions: {
    marginTop: Spacing.four,
  },
  actionTile: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
  helpCard: {
    marginTop: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  helpText: {
    marginTop: Spacing.one,
  },
});

