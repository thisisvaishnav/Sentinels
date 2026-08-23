import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {
  mockAssignedZone,
  mockEnumeratorProfile,
  mockPriorityTasks,
  mockQuickActions,
  mockRecentActivities,
  mockSyncStatus,
  mockTodayProgress,
} from '@/src/features/enumeration/mockEnumeratorData';

import { AssignedZoneSection } from '@/src/features/enumeration/components/AssignedZoneSection';
import { EnumeratorHeader } from '@/src/features/enumeration/components/EnumeratorHeader';
import { PriorityTasksSection } from '@/src/features/enumeration/components/PriorityTasksSection';
import { ProgressSection } from '@/src/features/enumeration/components/ProgressSection';
import { QuickActionsSection } from '@/src/features/enumeration/components/QuickActionsSection';
import { RecentActivitySection } from '@/src/features/enumeration/components/RecentActivitySection';
import { SyncStatusSection } from '@/src/features/enumeration/components/SyncStatusSection';
import { WelcomeSection } from '@/src/features/enumeration/components/WelcomeSection';

export default function EnumeratorDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* 1. Header */}
      <EnumeratorHeader profile={mockEnumeratorProfile} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Welcome Section */}
        <WelcomeSection profile={mockEnumeratorProfile} />

        {/* 3. Today's Progress */}
        <ProgressSection progress={mockTodayProgress} />

        {/* 4. Priority Tasks */}
        <PriorityTasksSection tasks={mockPriorityTasks} />

        {/* 5. Assigned Zone */}
        <AssignedZoneSection zone={mockAssignedZone} />

        {/* 6. Quick Actions */}
        <QuickActionsSection actions={mockQuickActions} />

        {/* 7. Sync Status */}
        <SyncStatusSection syncInfo={mockSyncStatus} />

        {/* 8. Recent Activity */}
        <RecentActivitySection activities={mockRecentActivities} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  body: {
    padding: 16,
    gap: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
