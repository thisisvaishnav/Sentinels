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

import { DetailedAdminProfile } from '@/src/features/admin/types/adminProfileTypes';
import { loadAdminProfile } from '@/src/features/admin/data/adminProfile';
import { signOut } from '@/src/features/auth/authService';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

import { AdminProfileHeader } from '@/src/features/admin/components/settings/AdminProfileHeader';
import { AdminProfileInfoCard } from '@/src/features/admin/components/settings/AdminProfileInfoCard';
import { AdminProfileStatsCard } from '@/src/features/admin/components/settings/AdminProfileStatsCard';
import { NotificationPreferencesCard } from '@/src/features/admin/components/settings/NotificationPreferencesCard';
import { AppPreferencesCard } from '@/src/features/admin/components/settings/AppPreferencesCard';
import { SecurityCard } from '@/src/features/admin/components/settings/SecurityCard';
import { AdminActionList } from '@/src/features/admin/components/settings/AdminActionList';

import { HelpSupportModal } from '@/src/features/enumeration/components/profile/HelpSupportModal';
import { AboutLokvisionModal } from '@/src/features/enumeration/components/profile/AboutLokvisionModal';
import { LogoutModal } from '@/src/features/enumeration/components/profile/LogoutModal';
import { ProfileLoadingState } from '@/src/features/enumeration/components/profile/ProfileLoadingState';
import { ProfileErrorState } from '@/src/features/enumeration/components/profile/ProfileErrorState';

export default function AdminSettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profile, setProfile] = useState<DetailedAdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const loadedProfile = await loadAdminProfile();
      setProfile(loadedProfile);
    } catch (err) {
      console.error('Failed to load admin profile data:', err);
      setError('Could not retrieve admin profile data. Please check your storage.');
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
      router.push('/(admin)/dashboard');
    }
  };

  const handleConfirmLogout = async () => {
    setIsLogoutVisible(false);
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Sign out error:', err);
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

      <AdminProfileHeader profile={profile} onBack={handleBack} />

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
        <AdminProfileInfoCard profile={profile} />

        <AdminProfileStatsCard
          totalEnumerators={24}
          activeSurveys={8}
          pendingReports={12}
          completedTasks={156}
          coveragePercentage={78}
        />

        <NotificationPreferencesCard />

        <AppPreferencesCard />

        <SecurityCard />

        <AdminActionList
          onPressEnumerators={() => router.push('/(admin)/field-enumerators')}
          onPressSurveys={() => router.push('/(admin)/survey-management')}
          onPressReports={() => router.push('/(admin)/citizen-reports')}
          onPressHelp={() => setIsHelpVisible(true)}
          onPressAbout={() => setIsAboutVisible(true)}
          onPressLogout={() => setIsLogoutVisible(true)}
        />
      </ScrollView>

      <HelpSupportModal
        visible={isHelpVisible}
        onClose={() => setIsHelpVisible(false)}
        supervisorName="DRISHTI Technical Support"
      />

      <AboutLokvisionModal
        visible={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
      />

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
