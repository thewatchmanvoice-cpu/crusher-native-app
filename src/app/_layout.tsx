import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { queryClient } from '@/lib/queryClient';

export default function RootLayout() {
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
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
