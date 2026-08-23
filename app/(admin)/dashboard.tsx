import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '@/src/features/auth/authService';

import DashboardHeader from '@/src/components/admin/DashboardHeader';
import StatCard from '@/src/components/admin/StatCard';
import ActionItem from '@/src/components/admin/ActionItem';
import ZoneProgress from '@/src/components/admin/ZoneProgress';
import RecentActivityItem from '@/src/components/admin/RecentActivityItem';
import BottomNavigation from '@/src/components/admin/BottomNavigation';
import SectionTitle from '@/src/components/admin/SectionTitle';
import { COLORS } from '@/constants/adminTheme';

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
  { icon: 'alert-circle-outline' as const, title: 'Blind spot detected in Sector 7', timestamp: '1 hr ago', iconColor: COLORS.danger },
  { icon: 'checkmark-done-outline' as const, title: 'Zone 2 — survey completed', timestamp: '2 hrs ago', iconColor: COLORS.success },
  { icon: 'sync-outline' as const, title: 'Batch data sync successful', timestamp: '3 hrs ago' },
];

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Home');

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('admin_logged_in');
            await signOut();
          } catch {
            // signOut already cleaned up locally even if the server call failed
          }
          router.replace('/onboarding');
        },
      },
    ]);
  }, [router]);

  const handleTabPress = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === 'Staff') {
        router.push('/(admin)/field-enumerators');
      }
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── Fixed Header ──────────────────────────────────────── */}
      <DashboardHeader onLogout={handleSignOut} />

      {/* ── Scrollable body ───────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <Text style={styles.welcomeTitle}>Welcome, Admin Central</Text>
        <Text style={styles.welcomeSub}>Here&apos;s your system overview for today</Text>

        {/* ── Stats grid ──────────────────────────────────────── */}
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

        {/* bottom spacing so content isn't hidden behind bottom nav */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Fixed Bottom Nav ──────────────────────────────────── */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  welcomeSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stack: {
    gap: 10,
  },
});
