import React, { useState, useEffect } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  getDerivedZoneMetrics,
  loadEnumeratorHouseholds,
  mockEnumeratorProfile,
  mockPriorityTasks,
  mockQuickActions,
  mockRecentActivities,
  mockSyncStatus,
} from '@/src/features/enumeration/data/households';
import { AssignedZoneInfo, PriorityTaskMetric, TodayProgress, ZoneHouseholdItem } from '@/src/features/enumeration/types';

import { AssignedZoneSection } from '@/src/features/enumeration/components/AssignedZoneSection';
import { EnumeratorDrawer } from '@/src/features/enumeration/components/EnumeratorDrawer';
import { EnumeratorHeader } from '@/src/features/enumeration/components/EnumeratorHeader';
import { PriorityTasksSection } from '@/src/features/enumeration/components/PriorityTasksSection';
import { ProgressSection } from '@/src/features/enumeration/components/ProgressSection';
import { QuickActionsSection } from '@/src/features/enumeration/components/QuickActionsSection';
import { RecentActivitySection } from '@/src/features/enumeration/components/RecentActivitySection';
import { SyncStatusSection } from '@/src/features/enumeration/components/SyncStatusSection';
import { WelcomeSection } from '@/src/features/enumeration/components/WelcomeSection';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export default function EnumeratorDashboard() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [households, setHouseholds] = useState<ZoneHouseholdItem[]>([]);

  useEffect(() => {
    async function fetchStore() {
      const list = await loadEnumeratorHouseholds();
      setHouseholds(list);
    }
    fetchStore();
  }, []);

  const metrics = getDerivedZoneMetrics(households);

  const todayProgress: TodayProgress = {
    totalAssigned: metrics.totalHouseholds,
    completed: metrics.completedCount,
    remaining: metrics.pendingCount + metrics.inProgressCount,
    coveragePercentage: metrics.overallCoveragePercent,
  };

  const assignedZoneInfo: AssignedZoneInfo = {
    zoneName: 'Zone A-12 · Ward 12',
    subArea: 'Shiv Nagar (East & West)',
    totalHouseholds: metrics.totalHouseholds,
    completedHouseholds: metrics.completedCount,
    coveragePercentage: metrics.overallCoveragePercent,
  };

  const handleTaskPress = (task: PriorityTaskMetric) => {
    if (task.id === 'p2') {
      router.push('/(enumerator)/blind-spots');
    } else if (task.id === 'p3') {
      router.push({ pathname: '/(enumerator)/priority-tasks', params: { category: 'Needs Verification' } });
    } else if (task.id === 'p4') {
      router.push({ pathname: '/(enumerator)/priority-tasks', params: { category: 'Urgent' } });
    } else {
      router.push({ pathname: '/(enumerator)/priority-tasks', params: { category: 'High Priority' } });
    }
  };

  const handleActionPress = (act: { id: string; label: string; route?: string }) => {
    const routeMap: Record<string, string> = {
      survey: '/(enumerator)/start-survey',
      register: '/(enumerator)/register-household',
      missing: '/(enumerator)/report-missing',
      map: '/(enumerator)/gis-map',
    };
    const route = act.route || routeMap[act.id] || '/(enumerator)/dashboard';
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.background} />

      <EnumeratorHeader
        profile={mockEnumeratorProfile}
        onOpenDrawer={() => setDrawerVisible(true)}
      />

      <EnumeratorDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        profile={mockEnumeratorProfile}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection
          profile={mockEnumeratorProfile}
          onProfilePress={() => router.push('/(enumerator)/profile')}
          onZonePress={() => router.push('/(enumerator)/assigned-zone')}
        />

        <ProgressSection progress={todayProgress} />

        <PriorityTasksSection
          tasks={mockPriorityTasks}
          onTaskPress={handleTaskPress}
          onViewAll={() => router.push('/(enumerator)/priority-tasks')}
        />

        <AssignedZoneSection
          zone={assignedZoneInfo}
          onCardPress={() => router.push('/(enumerator)/assigned-zone')}
          onViewRoute={() => router.push('/(enumerator)/gis-map')}
        />

        <QuickActionsSection actions={mockQuickActions} onActionPress={handleActionPress} />

        <SyncStatusSection syncInfo={mockSyncStatus} />

        <RecentActivitySection activities={mockRecentActivities} />

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
  body: {
    padding: 16,
    gap: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
