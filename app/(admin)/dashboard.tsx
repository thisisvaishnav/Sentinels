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

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome Card ──────────────────────────────────────── */}
        <WelcomeCard
          userName="Sarah Jenkins"
          zone="Zone A-12"
          ward="Ward 12"
          area="Shiv Nagar"
        />

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

        {/* ── Quick Actions ───────────────────────────────────── */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
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
  quickActionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
