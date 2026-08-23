import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface ActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  variant?: 'default' | 'danger';
  onPress?: () => void;
}

export default function ActionItem({ icon, title, description, variant = 'default', onPress }: ActionItemProps) {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      style={[styles.row, isDanger && styles.rowDanger]}
      activeOpacity={0.65}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, isDanger ? styles.iconDanger : styles.iconDefault]}>
        <Ionicons name={icon} size={18} color={isDanger ? COLORS.danger : COLORS.accent} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowDanger: {
    borderColor: COLORS.dangerLight,
    backgroundColor: COLORS.dangerSoft,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDefault: {
    backgroundColor: COLORS.accentSoft,
  },
  iconDanger: {
    backgroundColor: COLORS.dangerSoft,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
