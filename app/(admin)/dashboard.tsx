import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import AdminLayout from '@/src/components/admin/AdminLayout';
import StatCard from '@/src/components/admin/StatCard';
import ActionItem from '@/src/components/admin/ActionItem';
import ZoneProgress from '@/src/components/admin/ZoneProgress';
import RecentActivityItem from '@/src/components/admin/RecentActivityItem';
import SectionTitle from '@/src/components/admin/SectionTitle';
import ProgressCard from '@/src/components/shared/ProgressCard';
import PriorityTaskCard from '@/src/components/shared/PriorityTaskCard';
import WelcomeCard from '@/src/components/shared/WelcomeCard';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

/* ------------------------------------------------------------------ */
/* Mock data — swap for API calls later                                */
/* ------------------------------------------------------------------ */

const STATS = [
  { icon: 'home-outline' as const, label: 'Total Households', value: '12,450' },
  { icon: 'people-outline' as const, label: 'Active Enumerators', value: '84' },
  { icon: 'document-text-outline' as const, label: 'Survey Coverage', value: '73%' },
  {
    icon: 'alert-circle-outline' as const,
    label: 'Blind Spots',
    value: '12',
    variant: 'danger' as const,
    progress: 18,
  },
];

const ACTION_ITEMS = [
  { icon: 'checkmark-circle-outline' as const, title: 'Pending Verification', description: '5 surveys awaiting review' },
  { icon: 'warning-outline' as const, title: 'Active Risks', description: '3 zones flagged', variant: 'danger' as const },
  { icon: 'person-add-outline' as const, title: 'New Enumerator Assignment', description: '2 enumerators ready' },
  { icon: 'sync-outline' as const, title: 'Data Sync Pending', description: '84 records to upload' },
];

const ZONES = [
  { name: 'Zone 4 — Sector 12', percentage: 68, householdCount: 2340 },
  { name: 'Old Town', percentage: 91, householdCount: 1870 },
  { name: 'Railway Colony', percentage: 15, householdCount: 920 },
  { name: 'Green Park', percentage: 42, householdCount: 1560 },
];

const ACTIVITIES = [
  { icon: 'person-outline' as const, title: 'Rajesh assigned to Zone 3', timestamp: '12 min ago' },
  { icon: 'document-text-outline' as const, title: 'New report #892 submitted', timestamp: '28 min ago' },
  { icon: 'alert-circle-outline' as const, title: 'Blind spot detected in Sector 7', timestamp: '1 hr ago', iconColor: ENUMERATOR_THEME.colors.danger },
  { icon: 'checkmark-done-outline' as const, title: 'Zone 2 — survey completed', timestamp: '2 hrs ago', iconColor: ENUMERATOR_THEME.colors.success },
  { icon: 'sync-outline' as const, title: 'Batch data sync successful', timestamp: '3 hrs ago' },
];

const PRIORITY_TASKS = [
  {
    id: '1',
    title: 'Pending Verifications',
    count: 5,
    icon: 'checkmark-circle-outline' as const,
    color: ENUMERATOR_THEME.colors.warning,
    subtitle: 'surveys',
  },
  {
    id: '2',
    title: 'Active Risks',
    count: 3,
    icon: 'warning-outline' as const,
    color: ENUMERATOR_THEME.colors.danger,
    subtitle: 'zones',
  },
  {
    id: '3',
    title: 'New Assignments',
    count: 2,
    icon: 'person-add-outline' as const,
    color: ENUMERATOR_THEME.colors.accent,
    subtitle: 'enumerators',
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
        {/* Welcome Card */}
        <WelcomeCard
          userName="Admin"
          zoneInfo="System Overview"
        />

        {/* Today's Progress */}
        <ProgressCard
          title="System Progress"
          percentage={73}
          assigned={12450}
          completed={9089}
          remaining={3361}
        />

        {/* Priority Tasks */}
        <PriorityTaskCard tasks={PRIORITY_TASKS} />

        {/* ── Stats grid ──────────────────────────────────────── */}
        <SectionTitle title="Key Metrics" />
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </View>

        {/* ── Action Items ────────────────────────────────────── */}
        <SectionTitle title="Action Items" />
        <View style={styles.stack}>
          {ACTION_ITEMS.map((item, i) => (
            <ActionItem key={i} {...item} />
          ))}
        </View>

        {/* ── Survey Progress by Zone ─────────────────────────── */}
        <SectionTitle title="Survey Progress by Zone" />
        <View style={styles.stack}>
          {ZONES.map((zone, i) => (
            <ZoneProgress key={i} {...zone} />
          ))}
        </View>

        {/* ── Recent Activity ─────────────────────────────────── */}
        <SectionTitle title="Recent Activity" />
        <View style={styles.stack}>
          {ACTIVITIES.map((act, i) => (
            <RecentActivityItem key={i} {...act} />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
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
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stack: {
    gap: 10,
  },
  bottomSpacer: {
    height: 32,
  },
});
