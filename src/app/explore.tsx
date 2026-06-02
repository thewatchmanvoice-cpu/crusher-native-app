import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';

const communities = [
  {
    title: 'Open Creative Group',
    subtitle: 'Join a public feed of creators, updates, and shared posts.',
  },
  {
    title: 'Local Meetups',
    subtitle: 'Discover nearby community events and networking circles.',
  },
  {
    title: 'Featured Stories',
    subtitle: 'Browse the latest trending community stories curated for you.',
  },
];

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: Spacing.four, paddingBottom: insets.bottom + BottomTabInset }}>
      <ThemedText type="subtitle">Communities</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.description}>
        Explore groups, public feeds, and community hubs designed for engagement and discovery.
      </ThemedText>

      <View style={styles.cardList}>
        {communities.map((community) => (
          <ThemedView key={community.title} type="backgroundElement" style={styles.card}>
            <ThemedText type="default" style={styles.cardTitle}>
              {community.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {community.subtitle}
            </ThemedText>
          </ThemedView>
        ))}
      </View>

      <ThemedView type="backgroundElement" style={styles.helperCard}>
        <ThemedText type="smallBold">Mobile-first community navigation</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.helperText}>
          This section is optimized for Android users. Use it to surface feed categories, local groups, and trending community topics.
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
  helperCard: {
    marginTop: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  helperText: {
    marginTop: Spacing.one,
  },
});

