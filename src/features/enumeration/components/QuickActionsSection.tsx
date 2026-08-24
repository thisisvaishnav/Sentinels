import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QuickActionItem } from '../types';
import { ENUMERATOR_THEME, Theme } from '../theme';

interface QuickActionsSectionProps {
  actions: QuickActionItem[];
  theme?: Theme;
  onActionPress?: (action: QuickActionItem) => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
  theme = ENUMERATOR_THEME,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Quick Actions</Text>

      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={[styles.card, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
            onPress={() => onActionPress?.(act)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: act.color + '20', borderRadius: theme.borderRadius.lg }]}>
              <MaterialCommunityIcons
                name={act.iconName as any}
                size={26}
                color={act.color}
              />
            </View>
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{act.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
