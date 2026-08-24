import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import {
  getDerivedZoneMetrics,
  loadEnumeratorHouseholds,
} from '@/src/features/enumeration/data/households';
import { loadEnumeratorProfile } from '@/src/features/enumeration/data/enumeratorProfile';
import {
  deriveWorkBreakdownMetrics,
  filterTodayActivities,
  loadEnumeratorActivity,
} from '@/src/features/enumeration/data/activity';
import {
  EnumeratorActivityLog,
  WorkBreakdownMetrics,
  ZoneHouseholdItem,
} from '@/src/features/enumeration/types';

import { DailyProgressHeader } from '@/src/features/enumeration/components/daily-progress/DailyProgressHeader';
import { TodaySummaryCard } from '@/src/features/enumeration/components/daily-progress/TodaySummaryCard';
import { DailyTargetProgressCard } from '@/src/features/enumeration/components/daily-progress/DailyTargetProgressCard';
import { WorkBreakdownSection } from '@/src/features/enumeration/components/daily-progress/WorkBreakdownSection';
import { ActivityTimelineSection } from '@/src/features/enumeration/components/daily-progress/ActivityTimelineSection';
import { RecentHouseholdActivitySection } from '@/src/features/enumeration/components/daily-progress/RecentHouseholdActivitySection';
import { RemainingWorkSection } from '@/src/features/enumeration/components/daily-progress/RemainingWorkSection';
import { RecentDaysSection } from '@/src/features/enumeration/components/daily-progress/RecentDaysSection';
import {
  DailyProgressErrorState,
  DailyProgressLoadingState,
} from '@/src/features/enumeration/components/daily-progress/DailyProgressStates';

export default function DailyProgressScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);
  const [activities, setActivities] = useState<EnumeratorActivityLog[]>([]);
  const [dailyTarget, setDailyTarget] = useState<number>(25);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // 1. Fetch Shared Households Store
      const loadedHouseholds = await loadEnumeratorHouseholds();
      setHouseholds(loadedHouseholds);

      // 2. Fetch Enumerator Profile (for Daily Target)
      const profile = await loadEnumeratorProfile();
      setDailyTarget(profile.dailyTarget || 25);

      // 3. Fetch Activity Log Store
      const loadedActivities = await loadEnumeratorActivity();
      setActivities(loadedActivities);
    } catch (err) {
      console.error('Failed to load daily progress data:', err);
      setError('Unable to load daily progress data. Please try again.');
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
      <SafeAreaView style={styles.container}>
        <DailyProgressLoadingState />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <DailyProgressErrorState message={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  // Single Source of Truth Metrics Calculations
  const metrics = getDerivedZoneMetrics(households);
  const { today: todayActivities, earlier: earlierActivities } = filterTodayActivities(activities);
  const workBreakdown: WorkBreakdownMetrics = deriveWorkBreakdownMetrics(activities, true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* 1. Dynamic Header */}
      <DailyProgressHeader onRefresh={handleRefresh} isOffline={false} />

      {/* Main Vertically Scrollable Screen Body */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
            tintColor={ENUMERATOR_THEME.colors.accent}
          />
        }
      >
        {/* 2. Today Summary */}
        <TodaySummaryCard
          totalAssigned={metrics.totalHouseholds}
          completed={metrics.completedCount}
          inProgress={metrics.inProgressCount}
          pending={metrics.pendingCount}
          coveragePercentage={metrics.overallCoveragePercent}
        />

        {/* 3. Daily Target Progress */}
        <DailyTargetProgressCard target={dailyTarget} completed={metrics.completedCount} />

        {/* 4. Action Work Breakdown */}
        <WorkBreakdownSection metrics={workBreakdown} />

        {/* 5. Field Activity Timeline */}
        <ActivityTimelineSection
          todayActivities={todayActivities}
          earlierActivities={earlierActivities}
        />

        {/* 6. Recent Household Actions */}
        <RecentHouseholdActivitySection households={households} />

        {/* 7. Remaining Work Today */}
        <RemainingWorkSection
          pendingCount={metrics.pendingCount}
          needsVerificationCount={metrics.needsVerificationCount}
          highPriorityCount={metrics.highPriorityCount}
          urgentNeedsCount={metrics.urgentNeedsCount}
        />

        {/* 8. Recent Days Activity History */}
        <RecentDaysSection activities={activities} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  scrollBody: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  bottomSpacer: {
    height: 24,
  },
});
