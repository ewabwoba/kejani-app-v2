/**
 * Design tokens shared across every RN screen. Values are identical to
 * core/theme/tokens.ts in the web project and to Color.kt in the AI Studio
 * prototype — one palette, three surfaces, so screenshots never drift.
 */

export const color = {
  msitu900: '#081C15',
  msitu700: '#1B4332',
  msitu500: '#2D6A4F',
  msitu100: '#D8F3DC',

  udongo700: '#4E3629',
  udongo400: '#9E6B43',
  udongo100: '#F5EBE0',

  sisal600: '#C1652F',
  sisal500: '#D97706',

  parchment: '#FAF7F2',
  border: '#E6DFD5',
  ink: '#1C221F',
  inkMuted: '#6B7570',

  alert: '#B3261E',
  mpesaGreen: '#46B422',
  escrowGold: '#FFB703',
  boost: '#9E6B43',
  white: '#FFFFFF',
} as const;

export type EscrowStatus = 'HELD' | 'RELEASED' | 'REFUNDED';

export const font = {
  // Loaded via @expo-google-fonts packages in App.tsx — these strings must
  // match those export names exactly (that's what RN's font registry keys
  // on once useFonts() has loaded them).
  display: 'Fraunces_600SemiBold',
  body: 'WorkSans_400Regular',
  bodyMedium: 'WorkSans_500Medium',
  data: 'IBMPlexMono_500Medium',
} as const;

export const spacing = (n: number) => n * 4;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const type = {
  h1: { fontFamily: font.display, fontSize: 24, color: color.ink },
  h2: { fontFamily: font.display, fontSize: 18, color: color.ink },
  body: { fontFamily: font.body, fontSize: 14, color: color.ink },
  caption: { fontFamily: font.body, fontSize: 12, color: color.inkMuted },
  price: { fontFamily: font.data, fontSize: 15, color: color.msitu700 },
} as const;
