import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { generateMessageContent } from '@/lib/crushr-api';

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
  const [prompt, setPrompt] = useState('A playful note for a first date.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const content = await generateMessageContent({
        type: 'romantic_message',
        context: prompt,
        tone: 'warm',
        recipientName: 'Crushr',
      });

      setResult(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate content.');
    } finally {
      setLoading(false);
    }
  }

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
        <ThemedText type="smallBold">AI message generation</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
          Try the live backend contract to generate a romantic message right inside the app.
        </ThemedText>

        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Describe the vibe you want"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          multiline
        />

        <Pressable style={[styles.generateButton, { backgroundColor: theme.backgroundSelected }]} onPress={handleGenerate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateLabel}>Generate message</Text>}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {result ? <Text style={[styles.resultText, { color: theme.text }]}>{result}</Text> : null}
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
  input: {
    marginTop: Spacing.two,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  generateButton: {
    marginTop: Spacing.two,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  generateLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    marginTop: Spacing.two,
    color: '#ff8a80',
  },
  resultText: {
    marginTop: Spacing.two,
    lineHeight: 20,
  },
});

