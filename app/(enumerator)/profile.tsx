import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailedEnumeratorProfile } from '@/src/features/enumeration/types/profileTypes';
import { loadEnumeratorProfile } from '@/src/features/enumeration/data/enumeratorProfile';
import {
  getDerivedZoneMetrics,
  loadEnumeratorHouseholds,
} from '@/src/features/enumeration/data/households';
import { loadMissingReports } from '@/src/features/enumeration/data/missingReports';
import { signOut } from '@/src/features/auth/authService';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

import { ProfileHeader } from '@/src/features/enumeration/components/profile/ProfileHeader';
import { ProfileInfoCard } from '@/src/features/enumeration/components/profile/ProfileInfoCard';
import { ProfileStatsCard } from '@/src/features/enumeration/components/profile/ProfileStatsCard';
import { FieldPerformanceCard } from '@/src/features/enumeration/components/profile/FieldPerformanceCard';
import { ZoneInfoCard } from '@/src/features/enumeration/components/profile/ZoneInfoCard';
import { FieldActivitySummaryCard } from '@/src/features/enumeration/components/profile/FieldActivitySummaryCard';
import { OfflineSyncStatusCard } from '@/src/features/enumeration/components/profile/OfflineSyncStatusCard';
import { ProfileActionList } from '@/src/features/enumeration/components/profile/ProfileActionList';

import { HelpSupportModal } from '@/src/features/enumeration/components/profile/HelpSupportModal';
import { AboutLokvisionModal } from '@/src/features/enumeration/components/profile/AboutLokvisionModal';
import { LogoutModal } from '@/src/features/enumeration/components/profile/LogoutModal';

import { ProfileLoadingState } from '@/src/features/enumeration/components/profile/ProfileLoadingState';
import { ProfileErrorState } from '@/src/features/enumeration/components/profile/ProfileErrorState';

export default function EnumeratorProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profile, setProfile] = useState<DetailedEnumeratorProfile | null>(null);
  const [metrics, setMetrics] = useState({
    totalHouseholds: 0,
    completedCount: 0,
    inProgressCount: 0,
    pendingCount: 0,
    overallCoveragePercent: 0,
  });
  const [missingReportsCount, setMissingReportsCount] = useState(0);
  const [priorityTasksCount, setPriorityTasksCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal Visibility States
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const loadedProfile = await loadEnumeratorProfile();
      setProfile(loadedProfile);

      const households = await loadEnumeratorHouseholds();
      const zoneMetrics = getDerivedZoneMetrics(households);
      setMetrics({
        totalHouseholds: zoneMetrics.totalHouseholds,
        completedCount: zoneMetrics.completedCount,
        inProgressCount: zoneMetrics.inProgressCount,
        pendingCount: zoneMetrics.pendingCount,
        overallCoveragePercent: zoneMetrics.overallCoveragePercent,
      });

      // Priority tasks count (high priority + urgent + verification)
      const priorityCount = households.filter(
        (h) => h.priority === 'High' || h.status === 'Needs Verification' || h.status === 'In Progress'
      ).length;
      setPriorityTasksCount(priorityCount);

      const missingReports = await loadMissingReports();
      setMissingReportsCount(missingReports.length);
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError('Could not retrieve local profile data. Please check your storage.');
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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(enumerator)/dashboard');
    }
  };

  const handleConfirmLogout = async () => {
    setIsLogoutVisible(false);
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Sign out error:', err);
      // Fallback navigate to login
      router.replace('/(auth)/login');
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ProfileLoadingState />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ProfileErrorState error={error || 'Profile unavailable.'} onRetry={fetchData} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Header */}
      <ProfileHeader profile={profile} onBack={handleBack} />

      {/* Main Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
            tintColor={ENUMERATOR_THEME.colors.accent}
          />
        }
      >
        {/* 1. Profile Information Card */}
        <ProfileInfoCard profile={profile} />

        {/* 2. Assignment Summary Metrics */}
        <ProfileStatsCard
          totalAssigned={metrics.totalHouseholds}
          completed={metrics.completedCount}
          inProgress={metrics.inProgressCount}
          pending={metrics.pendingCount}
          coveragePercentage={metrics.overallCoveragePercent}
        />

        {/* 3. Field Performance */}
        <FieldPerformanceCard
          dailyTarget={profile.dailyTarget}
          completedToday={metrics.completedCount}
        />

        {/* 4. Active Zone Assignment */}
        <ZoneInfoCard
          profile={profile}
          onViewZone={() => router.push('/(enumerator)/assigned-zone')}
        />

        {/* 5. Field Activity Overview */}
        <FieldActivitySummaryCard
          totalHouseholds={metrics.totalHouseholds}
          missingReportsCount={missingReportsCount}
          priorityTasksCount={priorityTasksCount}
        />

        {/* 6. Data Status & Offline Sync */}
        <OfflineSyncStatusCard />

        {/* 7. Settings & Profile Actions */}
        <ProfileActionList
          onPressZone={() => router.push('/(enumerator)/assigned-zone')}
          onPressNotifications={() => router.push('/(enumerator)/notifications')}
          onPressPriorityTasks={() => router.push('/(enumerator)/priority-tasks')}
          onPressHelp={() => setIsHelpVisible(true)}
          onPressAbout={() => setIsAboutVisible(true)}
          onPressLogout={() => setIsLogoutVisible(true)}
        />
      </ScrollView>

      {/* Help Modal */}
      <HelpSupportModal
        visible={isHelpVisible}
        onClose={() => setIsHelpVisible(false)}
        supervisorName={profile.supervisor}
      />

      {/* About Modal */}
      <AboutLokvisionModal
        visible={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        visible={isLogoutVisible}
        onClose={() => setIsLogoutVisible(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
});
