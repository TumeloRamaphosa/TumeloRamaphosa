/**
 * Aviar VIP design system.
 * A restrained, luxury palette: deep midnight navy with champagne-gold
 * accents — intended to feel closer to a private-jet concierge than a
 * mass-market ride hail.
 */

export const palette = {
  // Base surfaces
  bg: '#0B0E1A',
  surface: '#131829',
  surfaceAlt: '#1B2237',
  border: '#283150',

  // Brand
  gold: '#D4AF37',
  goldSoft: '#E7CE7C',
  goldMuted: 'rgba(212, 175, 55, 0.14)',

  // Text
  text: '#F4F6FB',
  textMuted: '#9AA3BC',
  textFaint: '#5C6884',

  // Status
  success: '#3FD08C',
  warning: '#F2B544',
  danger: '#F2545B',
  info: '#5B8DEF',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '700' as const, letterSpacing: 0.2 },
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.4 },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
