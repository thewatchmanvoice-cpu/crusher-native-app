import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Button, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const WEB_URL = 'https://crushr.fun';

export default function HomeScreen() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [webViewKey, setWebViewKey] = useState(0);

  const webviewRef = useRef<WebView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const statusBarStyle = Platform.OS === 'android' ? 'light' : 'auto';

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.background, paddingTop: insets.top }],
    [theme.background, insets.top]
  );

  const checkNetworkState = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = state.isConnected && state.isInternetReachable !== false;
      setIsOffline(!connected);
      if (!connected) {
        setErrorMessage('No internet connection');
      } else if (errorMessage) {
        setErrorMessage(null);
      }
      return connected;
    } catch {
      setIsOffline(true);
      setErrorMessage('Unable to detect network state');
      return false;
    }
  }, [errorMessage]);

  const refreshWebView = useCallback(async () => {
    setIsRefreshing(true);
    await checkNetworkState();
    setWebViewKey((value) => value + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  }, [checkNetworkState]);

  const handleBackPress = useCallback(() => {
    if (canGoBack && webviewRef.current) {
      webviewRef.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    void checkNetworkState();
  }, [checkNetworkState]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, [handleBackPress]);

  const onNavigationStateChange = useCallback((event: WebViewNavigation) => {
    setCanGoBack(event.canGoBack);
  }, []);

  const onLoadProgress = useCallback((event: { nativeEvent: { progress: number } }) => {
    setProgress(event.nativeEvent.progress);
  }, []);

  const showOffline = isOffline || !!errorMessage;

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar style={statusBarStyle} backgroundColor={theme.backgroundElement} />
      <ThemedView style={[styles.header, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.brandRow}>
          <ThemedText type="subtitle">CRUSHR</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Social networking made native.
          </ThemedText>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/messages')}>
            <SymbolView name={{ android: 'message' }} size={20} tintColor={theme.text} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/profile')}>
            <SymbolView name={{ android: 'person' }} size={20} tintColor={theme.text} />
          </Pressable>
        </View>
      </ThemedView>

      <View style={[styles.statusBar, { backgroundColor: theme.backgroundElement, width: `${Math.min(progress * 100, 100)}%` }]} />

      {showOffline ? (
        <View style={styles.offlineContainer}>
          <ThemedText type="title">Offline mode</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.offlineText}>
            {errorMessage ?? 'Your device is not connected to the internet. Refresh to try again.'}
          </ThemedText>
          <View style={styles.offlineActions}>
            <Button title="Retry" onPress={refreshWebView} color={Platform.OS === 'android' ? '#0F4FA1' : undefined} />
          </View>
        </View>
      ) : (
        <View style={styles.webviewContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0F4FA1" />
              <ThemedText type="small" style={styles.loadingLabel}>
                Loading community feed...
              </ThemedText>
            </View>
          )}
          <WebView
            key={webViewKey}
            ref={webviewRef}
            source={{ uri: WEB_URL }}
            onNavigationStateChange={onNavigationStateChange}
            onLoadStart={() => {
              setIsLoading(true);
              setErrorMessage(null);
            }}
            onLoadEnd={() => setIsLoading(false)}
            onLoadProgress={onLoadProgress}
            onError={() => setErrorMessage('Unable to load the website')}
            pullToRefreshEnabled={Platform.OS === 'android'}
            onRefresh={refreshWebView}
            pullToRefreshBackgroundColor={theme.backgroundElement}
            startInLoadingState
            style={styles.webview}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d7d7d7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  brandRow: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
  },
  subtitleText: {
    marginTop: 4,
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  statusBar: {
    height: 3,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  offlineText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  offlineActions: {
    width: '100%',
    maxWidth: 320,
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loadingLabel: {
    marginTop: 10,
  },
});



