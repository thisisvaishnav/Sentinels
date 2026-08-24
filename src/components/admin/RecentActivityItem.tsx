import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface RecentActivityItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  timestamp: string;
  iconColor?: string;
}

export default function RecentActivityItem({ icon, title, timestamp, iconColor }: RecentActivityItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={iconColor ?? ENUMERATOR_THEME.colors.accent} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
  },
});
