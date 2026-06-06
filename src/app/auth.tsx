import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signInWithEmail, signUpWithEmail } from '@/services/auth';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      if (mode === 'signin') await signInWithEmail(email, password);
      else await signUpWithEmail(email, password, name);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Auth error', e.message || 'Something went wrong');
    } finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, padding: Spacing.xl, justifyContent: 'center' }}>
        <Text style={[Typography.h1, { color: Colors.primary }]}>Crushr</Text>
        <Text style={[Typography.caption, { marginBottom: Spacing.xl }]}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </Text>

        {mode === 'signup' && (
          <TextInput placeholder="Name" placeholderTextColor={Colors.textSubtle} value={name} onChangeText={setName} style={styles.input} />
        )}
        <TextInput placeholder="Email" placeholderTextColor={Colors.textSubtle} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor={Colors.textSubtle} secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

        <TouchableOpacity onPress={submit} disabled={busy} style={[styles.btn, busy && { opacity: 0.6 }]}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ marginTop: Spacing.lg, alignItems: 'center' }}>
          <Text style={Typography.caption}>
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, color: Colors.text, padding: Spacing.lg, borderRadius: Radius.lg, marginBottom: Spacing.md },
  btn: { backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: Radius.lg, alignItems: 'center', marginTop: Spacing.md },
});
