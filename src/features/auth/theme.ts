/**
 * auth/theme.ts
 *
 * Role-specific design tokens for auth screens (onboarding, login, register).
 * Each role gets its own accent color while sharing the same base structure.
 */

export interface AuthTheme {
  colors: {
    background: string;
    cardBackground: string;
    inputBackground: string;
    subtleBackground: string;
    accentSubtle: string;
    border: string;
    borderFocused: string;
    borderInput: string;
    primary: string;
    accent: string;
    accentDark: string;
    accentLight: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textWhite: string;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

/* ── Citizen: Sky Blue accent ── */

export const CITIZEN_AUTH_THEME: AuthTheme = {
  colors: {
    background: '#F1F5F9',
    cardBackground: '#FFFFFF',
    inputBackground: '#F8FAFC',
    subtleBackground: '#F1F5F9',
    accentSubtle: '#E0F2FE',
    border: '#E2E8F0',
    borderFocused: '#0EA5E9',
    borderInput: '#CBD5E1',
    primary: '#0F172A',
    accent: '#0EA5E9',
    accentDark: '#0284C7',
    accentLight: '#BAE6FD',
    textPrimary: '#0F172A',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    textWhite: '#FFFFFF',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

/* ── Enumerator: Bright Blue accent ── */

export const ENUMERATOR_AUTH_THEME: AuthTheme = {
  colors: {
    background: '#F5F8FA',
    cardBackground: '#FFFFFF',
    inputBackground: '#F8FAFC',
    subtleBackground: '#F1F5F9',
    accentSubtle: '#F0F9FF',
    border: '#E2E8F0',
    borderFocused: '#0284C7',
    borderInput: '#CBD5E1',
    primary: '#172A3A',
    accent: '#0284C7',
    accentDark: '#0369A1',
    accentLight: '#BAE6FD',
    textPrimary: '#172A3A',
    textSecondary: '#555D66',
    textMuted: '#64748B',
    textWhite: '#FFFFFF',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

/* ── Admin: Navy accent ── */

export const ADMIN_AUTH_THEME: AuthTheme = {
  colors: {
    background: '#F5F8FA',
    cardBackground: '#FFFFFF',
    inputBackground: '#F8FAFC',
    subtleBackground: '#F1F5F9',
    accentSubtle: '#E8EDF2',
    border: '#E2E8F0',
    borderFocused: '#172A3A',
    borderInput: '#CBD5E1',
    primary: '#172A3A',
    accent: '#172A3A',
    accentDark: '#0F1D2D',
    accentLight: '#94A3B8',
    textPrimary: '#172A3A',
    textSecondary: '#555D66',
    textMuted: '#64748B',
    textWhite: '#FFFFFF',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },
};

/* ── Role helpers ── */

export type AuthRole = 'citizen' | 'enumerator' | 'admin';

export function getAuthTheme(role: AuthRole): AuthTheme {
  switch (role) {
    case 'citizen':
      return CITIZEN_AUTH_THEME;
    case 'enumerator':
      return ENUMERATOR_AUTH_THEME;
    case 'admin':
      return ADMIN_AUTH_THEME;
  }
}
