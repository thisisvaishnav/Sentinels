import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PriorityTaskMetric } from '../types';
import { ENUMERATOR_THEME, Theme } from '../theme';

interface PriorityTasksSectionProps {
  tasks: PriorityTaskMetric[];
  theme?: Theme;
  onTaskPress?: (task: PriorityTaskMetric) => void;
  onViewAll?: () => void;
}

export const PriorityTasksSection: React.FC<PriorityTasksSectionProps> = ({
  tasks,
  theme = ENUMERATOR_THEME,
  onTaskPress,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Priority Tasks</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.8}>
          <Text style={[styles.viewAllText, { color: theme.colors.accent }]}>View All →</Text>
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
            style={[styles.card, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
            onPress={() => onTaskPress?.(item)}
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

            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.unitText, { color: theme.colors.textMuted }]} numberOfLines={1}>{item.unit}</Text>
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
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  card: {
    width: 165,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
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
    marginTop: 4,
  },
  unitText: {
    fontSize: 11,
  },
});
