import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { signUpWithEmail } from '@/services/auth';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Signup Error', err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[Typography.h1, { color: Colors.primary, marginBottom: Spacing.md }]}>Crushr</Text>

        <Text style={[Typography.h2, { marginBottom: Spacing.xs }]}>Create Account</Text>
        <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: Spacing.xl }]}>
          Join Crushr and start connecting.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={Colors.textSubtle}
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor={Colors.textSubtle}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textSubtle}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.textSubtle}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.signupButton, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')} disabled={loading}>
          <Text style={[Typography.caption, { color: Colors.primary, textAlign: 'center', marginTop: Spacing.lg }]}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    paddingVertical: 40,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  signupText: {
    color: '#fff',
    fontWeight: '700',
  },
});