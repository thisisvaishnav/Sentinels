import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  loadAdminDashboard,
  getAdminDerivedMetrics,
  AdminDashboardData,
} from '@/src/features/admin/data/dashboard';
import { ADMIN_THEME } from '@/src/features/admin/theme';

import { WelcomeSection } from '@/src/features/enumeration/components/WelcomeSection';
import { ProgressSection } from '@/src/features/enumeration/components/ProgressSection';
import { PriorityTasksSection } from '@/src/features/enumeration/components/PriorityTasksSection';
import { AssignedZoneSection } from '@/src/features/enumeration/components/AssignedZoneSection';
import { QuickActionsSection } from '@/src/features/enumeration/components/QuickActionsSection';
import { SyncStatusSection } from '@/src/features/enumeration/components/SyncStatusSection';
import { RecentActivitySection } from '@/src/features/enumeration/components/RecentActivitySection';

import AdminLayout from '@/src/components/admin/AdminLayout';
import { PriorityTaskMetric } from '@/src/features/enumeration/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    loadAdminDashboard().then(setDashboardData);
  }, []);

  if (!dashboardData) return null;

  const metrics = getAdminDerivedMetrics();

  const handleTaskPress = (task: PriorityTaskMetric) => {
    if (task.id === 'ap2') {
      router.push('/(admin)/field-enumerators');
    } else if (task.id === 'ap3') {
      router.push('/(admin)/field-enumerators');
    } else {
      router.push('/(admin)/field-enumerators');
    }
  };

  const handleActionPress = (act: { id: string; label: string; route?: string }) => {
    if (act.route) {
      router.push(act.route as any);
    }
  };

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection
          profile={dashboardData.profile as any}
          theme={ADMIN_THEME}
          onProfilePress={() => {}}
          onZonePress={() => {}}
        />

        <ProgressSection
          progress={metrics.todayProgress}
          theme={ADMIN_THEME}
          onPressDetails={() => {}}
        />

        <PriorityTasksSection
          tasks={dashboardData.priorityTasks}
          theme={ADMIN_THEME}
          onTaskPress={handleTaskPress}
          onViewAll={() => router.push('/(admin)/field-enumerators')}
        />

        <AssignedZoneSection
          zone={metrics.assignedZoneInfo}
          theme={ADMIN_THEME}
          onCardPress={() => {}}
          onViewRoute={() => {}}
        />

        <QuickActionsSection
          actions={dashboardData.quickActions}
          theme={ADMIN_THEME}
          onActionPress={handleActionPress}
        />

        <SyncStatusSection syncInfo={dashboardData.syncStatus} />

        <RecentActivitySection activities={dashboardData.recentActivities} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: ADMIN_THEME.colors.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
