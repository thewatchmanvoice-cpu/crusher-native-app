import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';

const conversations = [
  {
    title: 'Team Updates',
    subtitle: '5 unread messages Â· 2 new replies',
  },
  {
    title: 'Product Launch Group',
    subtitle: 'Your latest post received 22 likes',
  },
  {
    title: 'Mentor Chat',
    subtitle: 'Reply before tomorrow to keep the thread active',
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: Spacing.four, paddingBottom: insets.bottom + BottomTabInset }}>
      <ThemedText type="subtitle">Messages</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.description}>
        Keep important conversations close and respond to members without leaving the app.
      </ThemedText>

      <View style={styles.cardList}>
        {conversations.map((item) => (
          <ThemedView key={item.title} type="backgroundElement" style={styles.card}>
            <ThemedText type="default" style={styles.cardTitle}>
              {item.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {item.subtitle}
            </ThemedText>
          </ThemedView>
        ))}
      </View>

      <ThemedView type="backgroundElement" style={styles.helpCard}>
        <ThemedText type="smallBold">Direct message experience</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
          This screen is a native placeholder for your appâ€™s messaging flow. Connect it to your backend or use deep links to integrate chat sections in the website.
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
  cardList: {
    marginTop: Spacing.two,
  },
  card: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    marginBottom: Spacing.three,
  },
  cardTitle: {
    marginBottom: Spacing.one,
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

