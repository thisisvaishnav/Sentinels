import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.background} />

      {/* 1. Header with Hamburger Menu Button */}
      <EnumeratorHeader
        profile={mockEnumeratorProfile}
        onOpenDrawer={() => setDrawerVisible(true)}
      />

      {/* Navigation Drawer Modal */}
      <EnumeratorDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        profile={mockEnumeratorProfile}
      />

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
