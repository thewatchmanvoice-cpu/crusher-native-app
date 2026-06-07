import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';

interface Props {
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search…' }: Props) {
  return (
    <View style={styles.wrap}>
      <Search size={18} color={Colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSubtle}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, color: Colors.text, fontSize: 15, padding: 0 },
});
