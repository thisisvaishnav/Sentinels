import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PriorityTaskMetric } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface PriorityTasksSectionProps {
  tasks: PriorityTaskMetric[];
}

export const PriorityTasksSection: React.FC<PriorityTasksSectionProps> = ({ tasks }) => {
  const router = useRouter();

  const handleTaskPress = (item: PriorityTaskMetric) => {
    if (item.id === 'p2') {
      // Blind Spot Areas -> GIS Map with blind spot overlay
      router.push({
        pathname: '/(enumerator)/gis-map',
        params: { focus: 'blind-spot' },
      });
    } else if (item.id === 'p3') {
      // Unverified Households -> Priority Tasks filtered by Needs Verification
      router.push({
        pathname: '/(enumerator)/priority-tasks',
        params: { category: 'Needs Verification' },
      });
    } else if (item.id === 'p4') {
      // Anomaly Alerts / Urgent -> Priority Tasks filtered by Urgent
      router.push({
        pathname: '/(enumerator)/priority-tasks',
        params: { category: 'Urgent' },
      });
    } else {
      // High-Priority Households -> Priority Tasks filtered by High Priority
      router.push({
        pathname: '/(enumerator)/priority-tasks',
        params: { category: 'High Priority' },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Priority Tasks</Text>
        <TouchableOpacity
          onPress={() => router.push('/(enumerator)/priority-tasks')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tasks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleTaskPress(item)}
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

            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.unitText} numberOfLines={1}>{item.unit}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  card: {
    width: 165,
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
