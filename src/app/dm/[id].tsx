import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sendMessage, fetchMessages } from '@/services/dms';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function DMDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchMessages(String(id)).then(setMessages).catch(() => {});
  }, [id]);

  const send = async () => {
    if (!user || !text.trim()) return;
    const msg = await sendMessage(String(id), user.id, String(id), text.trim());
    setMessages(prev => [...prev, msg]);
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: Colors.background }}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }}
        renderItem={({ item }) => {
          const mine = item.sender_id === user?.id;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={{ color: mine ? '#fff' : Colors.text }}>{item.content}</Text>
            </View>
          );
        }}
      />
      <View style={styles.composer}>
        <TextInput value={text} onChangeText={setText} placeholder="Message…" placeholderTextColor={Colors.textSubtle} style={styles.input} />
        <TouchableOpacity onPress={send} style={styles.send}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: Spacing.md, borderRadius: Radius.lg, maxWidth: '80%' },
  mine: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  theirs: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  composer: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.surface, color: Colors.text, padding: Spacing.md, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border },
  send: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, justifyContent: 'center', borderRadius: Radius.pill },
});
