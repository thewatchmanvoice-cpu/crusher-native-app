import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { createPost } from '@/services/feed';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function ComposeScreen() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) return router.push('/auth');
    if (!text.trim()) return;
    setBusy(true);
    try {
      await createPost(user.id, text.trim());
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to post');
    } finally { setBusy(false); }
  };

  return (
    <View style={{ flex: 1, padding: Spacing.lg, backgroundColor: Colors.background, gap: Spacing.md }}>
      <TextInput
        autoFocus multiline
        placeholder="What's on your mind?"
        placeholderTextColor={Colors.textSubtle}
        value={text} onChangeText={setText}
        style={styles.input}
      />
      <TouchableOpacity onPress={submit} disabled={busy || !text.trim()} style={[styles.btn, (busy || !text.trim()) && { opacity: 0.5 }]}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{busy ? 'Posting…' : 'Post'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { flex: 1, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: Spacing.lg, borderRadius: Radius.lg, fontSize: 16, textAlignVertical: 'top' },
  btn: { backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center' },
});
