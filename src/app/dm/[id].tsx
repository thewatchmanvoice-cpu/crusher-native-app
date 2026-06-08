import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { fetchMessages, sendMessage } from '@/services/dms';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DMDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const otherId = params.id;
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user || !otherId || authLoading) return;
    setLoading(true);
    fetchMessages(user.id, otherId)
      .then(setMessages)
      .catch((err) => {
        console.error('Error fetching messages:', err);
        Alert.alert('Error', 'Could not load messages');
      })
      .finally(() => setLoading(false));
  }, [user?.id, otherId, authLoading]);

  const send = async () => {
    if (!user || !otherId || !text.trim()) return;
    setSending(true);
    try {
      const msg = await sendMessage(user.id, otherId, text.trim());
      setMessages(prev => [...prev, msg]);
      setText('');
    } catch (err: any) {
      console.error('Error sending message:', err);
      Alert.alert('Error', err?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.h3}>Message</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm, flexGrow: 1 }}
        inverted
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
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor={Colors.textSubtle}
          style={styles.input}
          editable={!sending}
        />
        <TouchableOpacity onPress={send} disabled={sending} style={styles.send}>
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  bubble: { padding: Spacing.md, borderRadius: Radius.lg, maxWidth: '80%' },
  mine: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  theirs: { alignSelf: 'flex-start', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  composer: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: Colors.surface, color: Colors.text, padding: Spacing.md, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border },
  send: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, justifyContent: 'center', borderRadius: Radius.pill },
});
