import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface PriorityTask {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  count: number;
  iconBg: string;
  iconColor: string;
}

interface PriorityTasksProps {
  tasks: PriorityTask[];
  onViewAll?: () => void;
}

export default function PriorityTasks({ tasks, onViewAll }: PriorityTasksProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Priority Tasks</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onViewAll}>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tasks.map((task, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: task.iconBg }]}>
                <Ionicons name={task.icon} size={20} color={task.iconColor} />
              </View>
              <Text style={[styles.count, { color: task.iconColor }]}>{task.count}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>{task.title}</Text>
            <Text style={styles.cardSubtitle}>{task.subtitle}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 16,
  },
  card: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
