import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PriorityTaskMetric } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface PriorityTasksSectionProps {
  tasks: PriorityTaskMetric[];
}

export const PriorityTasksSection: React.FC<PriorityTasksSectionProps> = ({ tasks }) => {
  const router = useRouter();

  const handleTaskPress = () => {
    router.push('/(enumerator)/priority-tasks');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Priority Tasks</Text>

      <View style={styles.grid}>
        {tasks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={handleTaskPress}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
                <MaterialCommunityIcons
                  name={item.iconName as any}
                  size={20}
                  color={item.color}
                />
              </View>
              <Text style={[styles.countText, { color: item.color }]}>{item.count}</Text>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.unitText}>{item.unit}</Text>
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
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginTop: 4,
  },
  unitText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
