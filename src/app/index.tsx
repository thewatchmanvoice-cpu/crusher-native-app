import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { getPublicConfig, type PublicConfig } from '@/lib/supabase';

export default function LandingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const data = await getPublicConfig();
        if (mounted) {
          setConfig(data);
          setConfigError(null);
        }
      } catch (error) {
        if (mounted) {
          setConfigError(error instanceof Error ? error.message : 'Unable to load backend config');
        }
      } finally {
        if (mounted) {
          setLoadingConfig(false);
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView type="backgroundElement" style={styles.heroCard}>
          <Text style={styles.eyebrow}>Crushr native</Text>
          <Text style={styles.title}>Anonymous notes, gift cards, and chatrooms in one elegant mobile shell.</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>This native shell mirrors the web experience with a premium dark theme, deep-link-ready screens, and quick access to the core social feed.</Text>

          <View style={styles.ctaRow}>
            <Pressable style={[styles.primaryButton, { backgroundColor: theme.backgroundSelected }]} onPress={() => router.push('/messages')}>
              <Text style={[styles.buttonLabel, { color: theme.text }]}>Get started</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, { backgroundColor: theme.backgroundElement }]} onPress={() => router.push('/profile')}>
              <Text style={[styles.buttonLabel, { color: theme.text }]}>Browse feed</Text>
            </Pressable>
          </View>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.backendCard}>
          <Text style={[styles.tileLabel, { color: theme.text }]}>Backend status</Text>
          <Text style={[styles.backendText, { color: theme.textSecondary }]}>
            {loadingConfig
              ? 'Checking Supabase public config…'
              : configError
                ? `Connection issue: ${configError}`
                : `OneSignal app ID: ${config?.onesignal_app_id ?? 'not configured'} • Socket: ${config?.socket_server_url ?? 'not configured'}`}
          </Text>
          {loadingConfig ? <ActivityIndicator style={styles.loader} color="#ff2d74" /> : null}
        </ThemedView>

        <View style={styles.grid}>
          {['Encrypted asks', 'Gift card reveal', 'Swipable chatrooms'].map((item) => (
            <ThemedView key={item} type="backgroundElement" style={styles.tile}>
              <Text style={[styles.tileLabel, { color: theme.text }]}>{item}</Text>
            </ThemedView>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, padding: 18, justifyContent: 'center' },
  heroCard: { borderRadius: 24, padding: 18 },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 2, color: '#ff2d74', fontSize: 12, marginBottom: 6 },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', lineHeight: 38, marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 21 },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  primaryButton: { flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  secondaryButton: { flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  buttonLabel: { fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 18 },
  backendCard: { borderRadius: 18, padding: 14, marginTop: 18 },
  backendText: { fontSize: 13, lineHeight: 18, marginTop: 6 },
  loader: { marginTop: 8 },
  tile: { flexBasis: '100%', borderRadius: 18, padding: 14 },
  tileLabel: { fontSize: 16, fontWeight: '600' },
});



