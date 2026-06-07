import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export function LoadingState() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 } });
