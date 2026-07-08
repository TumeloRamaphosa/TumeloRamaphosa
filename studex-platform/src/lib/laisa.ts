// LAISA Design System Tokens
// Based on DESIGN.md — "My business runs itself"

export const B = {
  // Light mode (marketing site)
  light: {
    ink: '#1A1714',
    paper: '#FBF8F3',
    surface: '#FFFFFF',
    surface2: '#F4EFE7',
    line: 'rgba(26,23,20,0.10)',
    muted: '#6B6457',
    primary: '#1F4D3D',
    signal: '#2FA572',
    accent: '#C9A86A',
    // Semantic
    success: '#2FA572',
    warning: '#C8862B',
    error: '#C0492F',
    info: '#3B6B8F',
  },

  // Dark mode (LAISA dashboard)
  dark: {
    ink: '#F2EEE6',
    paper: '#16140F',
    surface: '#1E1B15',
    surface2: '#262218',
    line: 'rgba(242,238,230,0.10)',
    muted: '#A39A87',
    primary: '#2E6B54',
    signal: '#3FBE85',
    accent: '#D4B574',
    // Semantic
    success: '#2FA572',
    warning: '#C8862B',
    error: '#C0492F',
    info: '#3B6B8F',
  },

  // CSS variables (dark mode defaults for dashboard)
  text: 'var(--color-ink, #F2EEE6)',
  bg: 'var(--color-paper, #16140F)',
  card: 'var(--color-surface, #1E1B15)',
  border: 'var(--color-line, rgba(242,238,230,0.10))',
  muted: 'var(--color-muted, #A39A87)',
  primary: 'var(--color-primary, #2E6B54)',
  signal: 'var(--color-signal, #3FBE85)',
  accent: 'var(--color-accent, #D4B574)',

  // Spacing scale
  spacing: {
    '2xs': '2px',
    'xs': '4px',
    'sm': '8px',
    'md': '16px',
    'lg': '24px',
    'xl': '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
  },

  // Border radius
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    pill: '9999px',
  },

  // Motion / Animation timings
  motion: {
    micro: '80ms',
    short: '200ms',
    medium: '320ms',
    long: '560ms',
    enter: 'cubic-bezier(0.16,1,0.3,1)',
    exit: 'ease-in',
    move: 'ease-in-out',
  },

  // Typography scale (rem, 16px root)
  fontSize: {
    xs: '0.8125rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.375rem',
    '2xl': '1.75rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
    '5xl': '3.75rem',
    hero: '4.5rem',
  },
}
