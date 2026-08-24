import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorActivityLog } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';
import { isSameLocalDay, isYesterdayLocalDay } from '../../data/activity';

interface RecentDaysSectionProps {
  activities: EnumeratorActivityLog[];
}

export const RecentDaysSection: React.FC<RecentDaysSectionProps> = ({ activities }) => {
  const now = new Date();

  const todayCount = activities.filter((act) => isSameLocalDay(act.timestamp, now)).length;
  const yesterdayCount = activities.filter((act) => isYesterdayLocalDay(act.timestamp)).length;
  const previousCount = activities.filter(
    (act) => !isSameLocalDay(act.timestamp, now) && !isYesterdayLocalDay(act.timestamp)
  ).length;

  const todayCompleted = activities.filter(
    (act) => isSameLocalDay(act.timestamp, now) && act.type === 'survey_completed'
  ).length;

  const yesterdayCompleted = activities.filter(
    (act) => isYesterdayLocalDay(act.timestamp) && act.type === 'survey_completed'
  ).length;

  const days = [
    {
      id: 'today',
      title: 'Today',
      dateLabel: now.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      totalEvents: todayCount,
      surveysCompleted: todayCompleted,
      badgeColor: ENUMERATOR_THEME.colors.accent,
    },
    {
      id: 'yesterday',
      title: 'Yesterday',
      dateLabel: 'Previous Day',
      totalEvents: yesterdayCount,
      surveysCompleted: yesterdayCompleted,
      badgeColor: '#64748B',
    },
    {
      id: 'previous',
      title: 'Earlier',
      dateLabel: 'Prior Field Work',
      totalEvents: previousCount,
      surveysCompleted: Math.max(0, activities.length - todayCount - yesterdayCount - 2),
      badgeColor: '#94A3B8',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="history"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Recent Activity History</Text>
        </View>
        <Text style={styles.subHint}>Multi-day Totals</Text>
      </View>

      <View style={styles.grid}>
        {days.map((d) => (
          <View key={d.id} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{d.title}</Text>
              <Text style={styles.dayDate}>{d.dateLabel}</Text>
            </View>

            <View style={styles.dayStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Events</Text>
                <Text style={[styles.statVal, { color: d.badgeColor }]}>{d.totalEvents}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Surveys</Text>
                <Text style={[styles.statVal, { color: ENUMERATOR_THEME.colors.success }]}>
                  {d.surveysCompleted}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,

  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subHint: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  dayCard: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  dayHeader: {
    gap: 2,
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  dayDate: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  dayStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
});
