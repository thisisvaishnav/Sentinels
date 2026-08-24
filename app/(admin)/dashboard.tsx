import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import {
  loadAdminDashboard,
  getAdminDerivedMetrics,
  AdminDashboardData,
} from '@/src/features/admin/data/dashboard';
import { loadSupervisorEscalations, getSupervisorEscalationMetrics } from '@/src/features/admin/data/supervisorEscalations';
import { ADMIN_THEME } from '@/src/features/admin/theme';
import { COLORS } from '@/constants/adminTheme';

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
  const [pendingEscalationsCount, setPendingEscalationsCount] = useState<number>(0);

  useEffect(() => {
    loadAdminDashboard().then(setDashboardData);
    loadSupervisorEscalations().then((list) => {
      const m = getSupervisorEscalationMetrics(list);
      setPendingEscalationsCount(m.pendingCount);
    });
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

        {/* ── Supervisor Escalations Quick Widget ───────────────── */}
        <TouchableOpacity
          style={styles.escalationWidgetCard}
          onPress={() => router.push('/(admin)/supervisor-escalations')}
          activeOpacity={0.85}
        >
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleWrap}>
              <MaterialCommunityIcons name="shield-alert" size={20} color={COLORS.warning} />
              <Text style={styles.widgetTitle}>Supervisor Requests</Text>
            </View>

            <View style={styles.widgetBadge}>
              <Text style={styles.widgetBadgeText}>{pendingEscalationsCount} PENDING</Text>
            </View>
          </View>

          <Text style={styles.widgetSubtitle}>
            Field enumerator escalations, senior inspector re-assignments & revisit requests.
          </Text>

          <View style={styles.widgetFooter}>
            <Text style={styles.widgetLinkText}>View Escalation Center</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.accent} />
          </View>
        </TouchableOpacity>

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
  escalationWidgetCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  widgetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  widgetBadge: {
    backgroundColor: COLORS.warningSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  widgetBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.warning,
  },
  widgetSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  widgetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  widgetLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  bottomSpacer: {
    height: 32,
  },
});
