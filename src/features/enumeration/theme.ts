/**
 * theme.ts
 *
 * Centralized design tokens and light theme constants for the Lokvision app.
 * Used by Enumerator, Admin, and Citizen modules.
 */

export const ENUMERATOR_THEME = {
  colors: {
    // Backgrounds
    background: '#F0F4F8',
    cardBackground: '#FFFFFF',
    inputBackground: '#F8FAFC',
    subtleBackground: '#F1F5F9',
    accentSubtle: '#EBF5FF',

    // Borders
    border: '#E0E7EF',
    borderFocused: '#1E88E5',
    borderSubtle: '#CBD5E1',
    divider: '#F0F0F0',

    // Brand & Accents
    primary: '#172A3A',
    accent: '#1E88E5',
    accentDark: '#1565C0',
    accentLight: '#BBDEFB',
    accentSoft: '#E3F2FD',

    // Text Colors
    textPrimary: '#172A3A',
    textSecondary: '#555D66',
    textMuted: '#64748B',
    textWhite: '#FFFFFF',

    // Status Colors
    success: '#059669',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    successText: '#065F46',
    successSoft: '#ECFDF5',

    warning: '#D97706',
    warningBg: '#FEF3C7',
    warningBorder: '#FDE68A',
    warningText: '#B45309',
    warningSoft: '#FEF3C7',

    danger: '#EF4444',
    dangerBg: '#FEF2F2',
    dangerBorder: '#FECACA',
    dangerText: '#991B1B',
    dangerSoft: '#FEF2F2',
    dangerLight: '#FECACA',

    // Info
    info: '#0284C7',
    infoSoft: '#E0F2FE',
    infoLight: '#BAE6FD',

    // Admin-specific
    primarySoft: '#F1F5F9',
    primaryDark: '#0F172A',
    inactive: '#9CA3AF',
    inactiveLight: '#F3F4F6',
    mapMarker: '#172A3A',
    lightBlue: '#E0F2FE',

    // Report-specific
    reportOrange: '#D97706',
    reportOrangeSoft: '#FEF3C7',
    reportBlue: '#0284C7',
    reportBlueSoft: '#E0F2FE',
    reportGreen: '#059669',
    reportGreenSoft: '#ECFDF5',
    reportGray: '#64748B',
    reportGraySoft: '#F1F5F9',

    // Roster / Command Center
    activeBg: '#E0F2FE',
    offDuty: '#64748B',
    offDutyBg: '#F1F5F9',
    issueReported: '#EF4444',
    issueReportedBg: '#FEF2F2',
    operationalBg: '#F1F5F9',
    operationalAccent: '#172A3A',

    // Misc
    dot: '#EF4444',
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;
