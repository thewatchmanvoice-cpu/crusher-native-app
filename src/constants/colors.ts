// Crushr palette — premium red, dark, glassmorphic
export const Colors = {
  primary: '#FF1744',       // pink/red accent
  primaryGlow: '#FF4569',
  background: '#0a0a0a',
  surface: '#141414',
  surfaceAlt: '#1c1c1e',
  border: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  textSubtle: '#71717a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  online: '#22c55e',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type ColorKey = keyof typeof Colors;
