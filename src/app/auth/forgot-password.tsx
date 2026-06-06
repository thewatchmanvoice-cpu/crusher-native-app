import { View, Text } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
      }}
    >
      <Text style={{ color: '#fff' }}>Forgot Password Page</Text>
    </View>
  );
}