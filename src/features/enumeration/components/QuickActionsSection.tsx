import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QuickActionItem } from '../types';

interface QuickActionsSectionProps {
  actions: QuickActionItem[];
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ actions }) => {
  const handleActionPress = (label: string) => {
    Alert.alert(label, `Launching ${label} module.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            style={styles.card}
            onPress={() => handleActionPress(act.label)}
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
    color: '#F8FAFC',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
