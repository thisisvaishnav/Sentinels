import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PriorityTaskMetric } from '../types';

interface PriorityTasksSectionProps {
  tasks: PriorityTaskMetric[];
}

export const PriorityTasksSection: React.FC<PriorityTasksSectionProps> = ({ tasks }) => {
  const handleTaskPress = (title: string, count: number) => {
    Alert.alert(title, `${count} items requiring field attention in your active zone.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Priority Tasks</Text>

      <View style={styles.grid}>
        {tasks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleTaskPress(item.title, item.count)}
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
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
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
    borderRadius: 8,
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
    color: '#E2E8F0',
    marginTop: 4,
  },
  unitText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
