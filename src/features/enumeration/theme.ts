/**
 * theme.ts
 *
 * Centralized design tokens and light theme constants for the Lokvision Enumerator module.
 */

export const ENUMERATOR_THEME = {
  colors: {
    // Backgrounds
    background: '#F5F8FA',       // Main page light background
    cardBackground: '#FFFFFF',   // Cards & surface background
    inputBackground: '#F8FAFC',  // Form input background
    subtleBackground: '#F1F5F9', // Subtle gray row / badge background
    accentSubtle: '#F0F9FF',     // Subtle blue background for active items / icons

    // Borders
    border: '#E2E8F0',           // Card and divider border color
    borderFocused: '#0284C7',    // Input focused border color
    borderSubtle: '#CBD5E1',     // Standard input border color

    // Brand & Accents
    primary: '#172A3A',          // Lokvision dark navy (headers, primary text, dark buttons)
    accent: '#0284C7',           // Lokvision bright blue (active states, links, main action buttons)
    accentDark: '#0369A1',       // Darker blue accent
    accentLight: '#BAE6FD',      // Light blue border accent

    // Text Colors
    textPrimary: '#172A3A',      // Dark navy / charcoal main text
    textSecondary: '#555D66',    // Muted body text
    textMuted: '#64748B',        // Light muted gray text
    textWhite: '#FFFFFF',        // White text on dark buttons / accents

    // Status Colors
    success: '#059669',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    successText: '#065F46',

    warning: '#D97706',
    warningBg: '#FEF3C7',
    warningBorder: '#FDE68A',
    warningText: '#B45309',

    danger: '#EF4444',
    dangerBg: '#FEF2F2',
    dangerBorder: '#FECACA',
    dangerText: '#991B1B',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;
