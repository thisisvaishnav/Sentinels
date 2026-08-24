import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  color?: string;
}

interface QuickActionsGridProps {
  title?: string;
  actions: QuickAction[];
}

export default function QuickActionsGrid({ title = 'Quick Actions', actions }: QuickActionsGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.card}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: (action.color || ENUMERATOR_THEME.colors.accent) + '20' }]}>
              <Ionicons
                name={action.icon}
                size={24}
                color={action.color || ENUMERATOR_THEME.colors.accent}
              />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
