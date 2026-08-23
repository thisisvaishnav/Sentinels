// constants/colors.ts
export const AppColors = {
  // Backgrounds
  bgMain:       '#F5F8FA',
  bgCard:       '#FFFFFF',
  bgInput:      '#F8FAFC',
  bgSubtle:     '#F1F5F9',
  bgHighlight:  '#F0F9FF',

  // Brand / Accent
  primary:      '#172A3A',
  blue:         '#0284C7',
  blueDark:     '#0369A1',
  blueLight:    '#BAE6FD',

  // Text
  textPrimary:  '#172A3A',
  textSecondary:'#555D66',
  textMuted:    '#64748B',
  textWhite:    '#FFFFFF',

  // Borders
  border:       '#E2E8F0',
  borderFocus:  '#0284C7',
  borderInput:  '#CBD5E1',

  // Status
  success:      '#059669',
  successBg:    '#ECFDF5',
  successText:  '#065F46',
  warning:      '#D97706',
  warningBg:    '#FEF3C7',
  warningText:  '#B45309',
  danger:       '#EF4444',
  dangerBg:     '#FEF2F2',
  dangerText:   '#991B1B',
} as const;

export const AppRadius = {
  sm:   8,
  md:   10,
  lg:   12,
  xl:   16,
  pill: 9999,
} as const;
