import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorActivityLog, EnumeratorActivityType } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';
import { formatActivityTime } from '../../data/activity';

interface ActivityTimelineSectionProps {
  todayActivities: EnumeratorActivityLog[];
  earlierActivities: EnumeratorActivityLog[];
}

export const ActivityTimelineSection: React.FC<ActivityTimelineSectionProps> = ({
  todayActivities,
  earlierActivities,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'earlier'>('today');

  const displayList = activeTab === 'today' ? todayActivities : earlierActivities;

  const getActivityConfig = (type: EnumeratorActivityType) => {
    switch (type) {
      case 'registered':
        return {
          icon: 'home-plus-outline' as const,
          color: '#10B981',
          bg: '#ECFDF5',
          label: 'Household Registered',
        };
      case 'survey_started':
        return {
          icon: 'clipboard-text-outline' as const,
          color: '#3B82F6',
          bg: '#EFF6FF',
          label: 'Survey Started',
        };
      case 'survey_completed':
        return {
          icon: 'clipboard-check-outline' as const,
          color: '#059669',
          bg: '#D1FAE5',
          label: 'Survey Completed',
        };
      case 'verification_completed':
        return {
          icon: 'shield-check-outline' as const,
          color: '#6366F1',
          bg: '#EEF2FF',
          label: 'Verification Completed',
        };
      case 'missing':
        return {
          icon: 'alert-decagram-outline' as const,
          color: '#F59E0B',
          bg: '#FFFBEB',
          label: 'Missing Reported',
        };
      case 'anomaly_reviewed':
        return {
          icon: 'alert-octagon-outline' as const,
          color: '#EC4899',
          bg: '#FDF2F8',
          label: 'Anomaly Reviewed',
        };
      case 'sync':
      default:
        return {
          icon: 'sync' as const,
          color: '#64748B',
          bg: '#F1F5F9',
          label: 'Batch Synced',
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="timeline-clock-outline"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Field Activity Timeline</Text>
        </View>

        {/* Tab Filters: Today / Earlier */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
              Today ({todayActivities.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'earlier' && styles.tabActive]}
            onPress={() => setActiveTab('earlier')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'earlier' && styles.tabTextActive]}>
              Earlier ({earlierActivities.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {displayList.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={32}
            color={ENUMERATOR_THEME.colors.textMuted}
          />
          <Text style={styles.emptyTitle}>No field activity recorded yet.</Text>
          <Text style={styles.emptySub}>
            Your activity will appear here as you complete field tasks.
          </Text>
        </View>
      ) : (
        <View style={styles.timelineList}>
          {displayList.map((item, idx) => {
            const config = getActivityConfig(item.type);
            const isLast = idx === displayList.length - 1;

            return (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                    <MaterialCommunityIcons name={config.icon} size={18} color={config.color} />
                  </View>
                  {!isLast && <View style={styles.verticalLine} />}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemTime}>{formatActivityTime(item.timestamp)}</Text>
                  </View>

                  {item.description ? (
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  ) : null}

                  {item.householdId && (
                    <View style={styles.tagWrap}>
                      <Text style={styles.tagText}>ID: {item.householdId}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
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
    gap: 14,

  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 2,
  },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  tabActive: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  tabTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySub: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    gap: 4,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemTime: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  itemDesc: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  tagWrap: {
    alignSelf: 'flex-start',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    marginTop: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
