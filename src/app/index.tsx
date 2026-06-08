import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { getSession } from '@/services/auth';
import { Colors } from '@/constants/colors';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session) router.replace('/(tabs)');
        else router.replace('/auth/login');
      } catch (_) {
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});