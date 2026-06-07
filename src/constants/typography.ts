import { TextStyle } from 'react-native';
import { Colors } from './colors';

export const Typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: Colors.text },
  body: { fontSize: 15, fontWeight: '400', color: Colors.text, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600', color: Colors.text },
  caption: { fontSize: 13, fontWeight: '400', color: Colors.textMuted },
  small: { fontSize: 11, fontWeight: '500', color: Colors.textSubtle },
  button: { fontSize: 15, fontWeight: '600', color: Colors.text },
};
