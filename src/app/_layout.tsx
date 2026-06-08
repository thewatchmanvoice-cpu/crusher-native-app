import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';

import { Colors } from '@/constants/colors';
import { queryClient } from '@/lib/queryClient';
import getSupabase from '@/lib/supabase';

export default function RootLayout() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        router.replace('/auth/login');
        setIsCheckingSession(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      } catch (_) {
        router.replace('/auth/login');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
      }}
    >
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />

          {isCheckingSession ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: Colors.background,
                },
                headerTintColor: Colors.text,
                contentStyle: {
                  backgroundColor: Colors.background,
                },
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="auth/login"
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="auth"
                options={{
                  headerShown: false,
                  presentation: 'modal',
                }}
              />

              <Stack.Screen
                name="compose"
                options={{
                  title: 'New Post',
                  presentation: 'modal',
                }}
              />

              <Stack.Screen
                name="notifications"
                options={{
                  title: 'Notifications',
                }}
              />

              <Stack.Screen
                name="settings"
                options={{
                  title: 'Settings',
                }}
              />
            </Stack>
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
