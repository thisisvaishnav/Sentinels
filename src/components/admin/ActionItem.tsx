import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

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
        <Ionicons name={icon} size={18} color={isDanger ? ENUMERATOR_THEME.colors.danger : ENUMERATOR_THEME.colors.accent} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
    </TouchableOpacity>
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
  rowDanger: {
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDefault: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
  },
  iconDanger: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  description: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 2,
  },
});
