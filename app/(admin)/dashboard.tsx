import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import AdminLayout from '@/src/components/admin/AdminLayout';
import WelcomeCard from '@/src/components/admin/WelcomeCard';
import TodaysProgress from '@/src/components/admin/TodaysProgress';
import PriorityTasks from '@/src/components/admin/PriorityTasks';
import AssignedZoneCard from '@/src/components/admin/AssignedZoneCard';
import { COLORS } from '@/constants/adminTheme';

/* ------------------------------------------------------------------ */
/* Mock data — swap for API calls later                                */
/* ------------------------------------------------------------------ */

const PRIORITY_TASKS = [
  {
    icon: 'home' as const,
    title: 'High-Priority Households',
    subtitle: 'urgent surveys',
    count: 8,
    iconBg: COLORS.dangerSoft,
    iconColor: COLORS.danger,
  },
  {
    icon: 'eye-off' as const,
    title: 'Blind-Spot Areas',
    subtitle: 'unmapped clusters',
    count: 3,
    iconBg: COLORS.warningSoft,
    iconColor: COLORS.warning,
  },
  {
    icon: 'alert-circle' as const,
    title: 'Unverified Data',
    subtitle: 'pending review',
    count: 5,
    iconBg: COLORS.infoSoft,
    iconColor: COLORS.info,
  },
];

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { loadSupervisorEscalations, getSupervisorEscalationMetrics } from '@/src/features/admin/data/supervisorEscalations';

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingEscalationsCount, setPendingEscalationsCount] = React.useState<number>(0);

  React.useEffect(() => {
    loadSupervisorEscalations().then((list) => {
      const m = getSupervisorEscalationMetrics(list);
      setPendingEscalationsCount(m.pendingCount);
    });
  }, []);

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome Card ──────────────────────────────────────── */}
        <WelcomeCard
          userName="Priya Sharma"
          zone="Zone A-12"
          ward="Ward 12"
          area="Shiv Nagar"
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

        {/* ── Today's Progress ─────────────────────────────────── */}
        <TodaysProgress assigned={14} completed={5} remaining={7} />

        {/* ── Priority Tasks ──────────────────────────────────── */}
        <PriorityTasks tasks={PRIORITY_TASKS} />

        {/* ── Assigned Zone ───────────────────────────────────── */}
        <AssignedZoneCard
          zone="Zone A-12"
          ward="Ward 12"
          area="Shiv Nagar (East & West)"
          households={14}
          completed={5}
          coverage={36}
        />
      </ScrollView>
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 16,
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
  quickActionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
