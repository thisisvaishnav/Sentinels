import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminLayout from '@/src/components/admin/AdminLayout';
import { COLORS } from '@/constants/adminTheme';
import {
  getAdminTodayProgressSummary,
  AdminTodayProgressSummary,
} from '@/src/features/admin/data/dashboard';
import { formatActivityTime } from '@/src/features/enumeration/data/activity';

const ACTIVITY_ICON_MAP: Record<string, { name: string; color: string }> = {
  survey_completed: { name: 'clipboard-check-outline', color: COLORS.success },
  verification_completed: { name: 'shield-check-outline', color: COLORS.info },
  registered: { name: 'home-plus-outline', color: COLORS.accent },
  survey_started: { name: 'clipboard-edit-outline', color: COLORS.warning },
  missing: { name: 'alert-circle-outline', color: COLORS.danger },
  anomaly_reviewed: { name: 'radar', color: COLORS.warning },
  sync: { name: 'sync-outline', color: COLORS.textMuted },
  verified: { name: 'checkmark-circle-outline', color: COLORS.success },
};

export default function AdminTodayProgressScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<AdminTodayProgressSummary | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const summary = await getAdminTodayProgressSummary();
      setData(summary);
    } catch (err) {
      console.error('Failed to load today progress:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (isLoading && !isRefreshing) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No data available</Text>
        </View>
      </AdminLayout>
    );
  }

  const { zoneMetrics, todayActivities, workBreakdown } = data;

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
      >
        {/* Back Navigation */}
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.navBackBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            <Text style={styles.navBackText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <View style={styles.pageTitleRow}>
          <MaterialCommunityIcons name="chart-arc" size={24} color={COLORS.accent} />
          <Text style={styles.pageTitle}>Today{"'"}s Progress</Text>
        </View>

        {/* 1. Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: COLORS.accent }]}>
            <Text style={styles.summaryLabel}>Assigned</Text>
            <Text style={[styles.summaryValue, { color: COLORS.accent }]}>{zoneMetrics.totalHouseholds}</Text>
            <Text style={styles.summarySub}>Households</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: COLORS.success }]}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>{zoneMetrics.completedCount}</Text>
            <Text style={styles.summarySub}>Surveys done</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: COLORS.warning }]}>
            <Text style={styles.summaryLabel}>In Progress</Text>
            <Text style={[styles.summaryValue, { color: COLORS.warning }]}>{zoneMetrics.inProgressCount}</Text>
            <Text style={styles.summarySub}>Active visits</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: COLORS.textMuted }]}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: COLORS.textSecondary }]}>{zoneMetrics.pendingCount}</Text>
            <Text style={styles.summarySub}>Awaiting visit</Text>
          </View>
        </View>

        {/* 2. Coverage Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="progress-check" size={18} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Zone Coverage</Text>
            <View style={styles.coverageBadge}>
              <Text style={styles.coveragePercent}>{zoneMetrics.overallCoveragePercent}%</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${zoneMetrics.overallCoveragePercent}%`, backgroundColor: COLORS.accent },
              ]}
            />
          </View>
          <Text style={styles.coverageSubtext}>
            {zoneMetrics.completedCount} of {zoneMetrics.totalHouseholds} households surveyed
          </Text>
        </View>

        {/* 3. Area Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="map-marker-multiple-outline" size={18} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Area Breakdown</Text>
          </View>
          {zoneMetrics.derivedAreas.map((area) => {
            const pct = area.totalHouseholds > 0
              ? Math.round((area.completedHouseholds / area.totalHouseholds) * 100)
              : 0;
            return (
              <View key={area.id} style={styles.areaRow}>
                <View style={styles.areaInfo}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={styles.areaCount}>
                    {area.completedHouseholds}/{area.totalHouseholds}
                  </Text>
                </View>
                <View style={styles.areaTrack}>
                  <View
                    style={[
                      styles.areaFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: pct >= 75 ? COLORS.success : pct >= 40 ? COLORS.warning : COLORS.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.areaPct}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        {/* 4. Work Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={18} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Work Breakdown</Text>
          </View>
          <View style={styles.breakdownGrid}>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={20} color={COLORS.success} />
              <Text style={styles.breakdownValue}>{workBreakdown.surveysCompleted}</Text>
              <Text style={styles.breakdownLabel}>Surveys Completed</Text>
            </View>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="home-plus-outline" size={20} color={COLORS.accent} />
              <Text style={styles.breakdownValue}>{workBreakdown.householdsRegistered}</Text>
              <Text style={styles.breakdownLabel}>Registered</Text>
            </View>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color={COLORS.info} />
              <Text style={styles.breakdownValue}>{workBreakdown.verificationsCompleted}</Text>
              <Text style={styles.breakdownLabel}>Verifications</Text>
            </View>
            <View style={styles.breakdownItem}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.danger} />
              <Text style={styles.breakdownValue}>{workBreakdown.missingReports}</Text>
              <Text style={styles.breakdownLabel}>Missing Reports</Text>
            </View>
          </View>
        </View>

        {/* 5. Today's Activity Timeline */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Today{"'"}s Activity</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{todayActivities.length}</Text>
            </View>
          </View>
          {todayActivities.length === 0 ? (
            <Text style={styles.emptyText}>No activity recorded today yet.</Text>
          ) : (
            todayActivities.map((act) => {
              const icon = ACTIVITY_ICON_MAP[act.type] || { name: 'circle-outline', color: COLORS.textMuted };
              return (
                <View key={act.id} style={styles.activityRow}>
                  <View style={[styles.activityIconWrap, { backgroundColor: icon.color + '15' }]}>
                    <MaterialCommunityIcons name={icon.name as any} size={16} color={icon.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{act.title}</Text>
                    {act.description ? (
                      <Text style={styles.activityDesc} numberOfLines={2}>{act.description}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.activityTime}>{formatActivityTime(act.timestamp)}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* 6. Remaining Work */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="alert-decagram-outline" size={18} color={COLORS.danger} />
            <Text style={styles.cardTitle}>Remaining Work</Text>
          </View>
          <View style={styles.remainingRow}>
            <View style={styles.remainingItem}>
              <View style={[styles.remainingDot, { backgroundColor: COLORS.danger }]} />
              <Text style={styles.remainingLabel}>High Priority</Text>
              <Text style={[styles.remainingValue, { color: COLORS.danger }]}>{zoneMetrics.highPriorityCount}</Text>
            </View>
            <View style={styles.remainingItem}>
              <View style={[styles.remainingDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.remainingLabel}>Urgent Needs</Text>
              <Text style={[styles.remainingValue, { color: COLORS.warning }]}>{zoneMetrics.urgentNeedsCount}</Text>
            </View>
            <View style={styles.remainingItem}>
              <View style={[styles.remainingDot, { backgroundColor: COLORS.info }]} />
              <Text style={styles.remainingLabel}>Needs Verification</Text>
              <Text style={[styles.remainingValue, { color: COLORS.info }]}>{zoneMetrics.needsVerificationCount}</Text>
            </View>
            <View style={styles.remainingItem}>
              <View style={[styles.remainingDot, { backgroundColor: COLORS.textMuted }]} />
              <Text style={styles.remainingLabel}>Missing</Text>
              <Text style={[styles.remainingValue, { color: COLORS.textMuted }]}>{zoneMetrics.missingCount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  navBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  summarySub: {
    fontSize: 9,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  coverageBadge: {
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coveragePercent: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.accent,
  },
  progressTrack: {
    height: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  coverageSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  areaRow: {
    gap: 6,
  },
  areaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  areaCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  areaTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  areaFill: {
    height: '100%',
    borderRadius: 3,
  },
  areaPct: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownItem: {
    width: '47%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  countBadge: {
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  activityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  activityDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  remainingRow: {
    gap: 10,
  },
  remainingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  remainingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  remainingLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    flex: 1,
  },
  remainingValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: 24,
  },
});
