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

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (
      !fullName ||
      !username ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    Alert.alert(
      'Signup Ready',
      'Next step is connecting this form to Supabase.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>❤️ Crushr</Text>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Crushr and start connecting.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
        >
          <Text style={styles.signupText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.loginText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF1744',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    marginTop: 5,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    color: '#FFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  signupButton: {
    backgroundColor: '#FF1744',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  loginText: {
    color: '#FF1744',
    textAlign: 'center',
    marginTop: 25,
  },
});