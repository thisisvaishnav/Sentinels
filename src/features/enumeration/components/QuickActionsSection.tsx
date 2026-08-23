import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { QuickActionItem } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface QuickActionsSectionProps {
  actions: QuickActionItem[];
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ actions }) => {
  const router = useRouter();

  const getActionRoute = (id: string, label: string): string => {
    switch (id) {
      case 'survey':
        return '/(enumerator)/start-survey';
      case 'register':
        return '/(enumerator)/register-household';
      case 'missing':
        return '/(enumerator)/report-missing';
      case 'map':
        return '/(enumerator)/gis-map';
      default:
        if (label.includes('Survey')) return '/(enumerator)/start-survey';
        if (label.includes('Register')) return '/(enumerator)/register-household';
        if (label.includes('Missing')) return '/(enumerator)/report-missing';
        if (label.includes('Map')) return '/(enumerator)/gis-map';
        return '/(enumerator)/dashboard';
    }
  };

  const handleActionPress = (act: QuickActionItem) => {
    const route = getActionRoute(act.id, act.label);
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={styles.card}
            onPress={() => handleActionPress(act)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: act.color + '20' }]}>
              <MaterialCommunityIcons
                name={act.iconName as any}
                size={26}
                color={act.color}
              />
            </View>
            <Text style={styles.label}>{act.label}</Text>
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
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
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
