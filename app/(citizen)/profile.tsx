import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

import { CITIZEN_THEME } from '@/src/features/enumeration/theme';
import { signOut } from '@/src/features/auth/authService';

const T = CITIZEN_THEME;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001';

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

type CitizenProfile = {
  name: string;
  mobile: string;
  zone: string;
  householdId: string;
  totalMembers: number;
  ward: string;
  district: string;
};

/* -------------------------------------------------------------------------- */
/*                              Profile Header                                */
/* -------------------------------------------------------------------------- */

function ProfileHeader({ profile, onBack }: { profile: CitizenProfile; onBack: () => void }) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Ionicons name="arrow-back" size={22} color={T.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={s.headerTitle}>Profile & Settings</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Profile Info Card                              */
/* -------------------------------------------------------------------------- */

function ProfileInfoCard({ profile }: { profile: CitizenProfile }) {
  return (
    <View style={s.card}>
      <View style={s.profileAvatar}>
        <MaterialCommunityIcons name="account" size={40} color={T.colors.accent} />
      </View>
      <Text style={s.profileName}>{profile.name}</Text>
      <Text style={s.profileId}>ID: {profile.mobile}</Text>
      <View style={s.profileZoneBadge}>
        <Ionicons name="location-outline" size={14} color={T.colors.accent} />
        <Text style={s.profileZoneText}>{profile.zone}</Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Stats Card                                      */
/* -------------------------------------------------------------------------- */

function ProfileStatsCard({ totalMembers, ward, district }: { totalMembers: number; ward: string; district: string }) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.cardIconWrap}>
          <MaterialCommunityIcons name="chart-bar" size={20} color={T.colors.accent} />
        </View>
        <Text style={s.cardTitle}>Household Summary</Text>
      </View>

      <View style={s.statsGrid}>
        <View style={s.statItem}>
          <Text style={s.statValue}>{totalMembers}</Text>
          <Text style={s.statLabel}>Members</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>{ward}</Text>
          <Text style={s.statLabel}>Ward</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>{district}</Text>
          <Text style={s.statLabel}>District</Text>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Toggle Card                                      */
/* -------------------------------------------------------------------------- */

function ToggleCard({ title, icon, description, enabled, onToggle }: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={s.toggleCard}>
      <View style={s.toggleLeft}>
        <View style={s.toggleIconWrap}>
          <Ionicons name={icon} size={18} color={T.colors.accent} />
        </View>
        <View style={s.toggleCopy}>
          <Text style={s.toggleTitle}>{title}</Text>
          <Text style={s.toggleDesc}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[s.toggleSwitch, enabled && s.toggleSwitchOn]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[s.toggleKnob, enabled && s.toggleKnobOn]} />
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Action List                                     */
/* -------------------------------------------------------------------------- */

function ActionItem({ icon, label, onPress, danger }: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={s.actionItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.actionIconWrap, danger && { backgroundColor: T.colors.dangerBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={danger ? T.colors.danger : T.colors.accent} />
      </View>
      <Text style={[s.actionLabel, danger && { color: T.colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={T.colors.textMuted} />
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function CitizenProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profile, setProfile] = useState<CitizenProfile>({
    name: 'Citizen',
    mobile: '',
    zone: '',
    householdId: '',
    totalMembers: 0,
    ward: '',
    district: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const fetchData = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('citizen_token');
      if (!token) {
        router.replace({ pathname: '/(auth)/login', params: { role: 'citizen' } });
        return;
      }

      const res = await fetch(`${API_URL}/api/household/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const result = await res.json();
        const h = result.household;
        if (h) {
          setProfile({
            name: h.head_full_name ?? 'Citizen',
            mobile: h.head_mobile_number ?? '',
            zone: `${h.locality ?? ''} · Ward ${h.ward ?? ''}`,
            householdId: h.id ?? '',
            totalMembers: h.total_members ?? 0,
            ward: h.ward ?? '',
            district: h.district ?? '',
          });
        }
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

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
      router.push('/(citizen)/dashboard');
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
    } catch {
      // Ignore sign out errors
    }
    router.replace('/onboarding');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: handleConfirmLogout },
      ],
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={T.colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.cardBackground} />

      <ProfileHeader profile={profile} onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[T.colors.accent]}
            tintColor={T.colors.accent}
          />
        }
      >
        <ProfileInfoCard profile={profile} />

        <ProfileStatsCard
          totalMembers={profile.totalMembers}
          ward={profile.ward}
          district={profile.district}
        />

        {/* Notification Preferences */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardIconWrap}>
              <Ionicons name="notifications-outline" size={20} color={T.colors.accent} />
            </View>
            <Text style={s.cardTitle}>Notification Preferences</Text>
          </View>
          <ToggleCard
            title="Push Notifications"
            icon="notifications-outline"
            description="Receive alerts about scheme updates and community issues"
            enabled={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </View>

        {/* App Preferences */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardIconWrap}>
              <Ionicons name="settings-outline" size={20} color={T.colors.accent} />
            </View>
            <Text style={s.cardTitle}>App Preferences</Text>
          </View>
          <ToggleCard
            title="Location Sharing"
            icon="location-outline"
            description="Share location for faster service responses"
            enabled={locationSharing}
            onToggle={() => setLocationSharing(!locationSharing)}
          />
          <ToggleCard
            title="Dark Mode"
            icon="moon-outline"
            description="Switch to dark theme (coming soon)"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </View>

        {/* Quick Actions */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardIconWrap}>
              <Ionicons name="grid-outline" size={20} color={T.colors.accent} />
            </View>
            <Text style={s.cardTitle}>Quick Links</Text>
          </View>
          <ActionItem
            icon="home-group"
            label="My Household"
            onPress={() => router.push('/(citizen)/household')}
          />
          <ActionItem
            icon="file-document-outline"
            label="Government Schemes"
            onPress={() => router.push('/(citizen)/schemes')}
          />
          <ActionItem
            icon="chart-line"
            label="My Progress"
            onPress={() => router.push('/(citizen)/progress')}
          />
          <ActionItem
            icon="headset"
            label="Help & Support"
            onPress={() => router.push('/(citizen)/support')}
          />
          <ActionItem
            icon="information-outline"
            label="About DRISHTI"
            onPress={() => Alert.alert('About DRISHTI', 'DRISHTI Citizen Portal v1.0\n\nA digital governance platform for citizens to access government schemes, report community issues, and track their household data.')}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleSignOut} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={20} color={T.colors.danger} />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Styles                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
});

const s = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: T.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },

  /* Profile Card */
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: T.colors.accentLight,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: T.colors.textPrimary,
    textAlign: 'center',
    marginTop: 12,
  },
  profileId: {
    fontSize: 13,
    color: T.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  profileZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: T.borderRadius.sm,
    alignSelf: 'center',
    marginTop: 8,
  },
  profileZoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.colors.accent,
  },

  /* Card */
  card: {
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    borderRadius: T.borderRadius.lg,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },

  /* Stats */
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: T.colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: T.colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: T.colors.border,
  },

  /* Toggle Card */
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIconWrap: {
    width: 32,
    height: 32,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCopy: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textPrimary,
  },
  toggleDesc: {
    fontSize: 12,
    color: T.colors.textMuted,
    marginTop: 1,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.colors.borderSubtle,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchOn: {
    backgroundColor: T.colors.accent,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },

  /* Action List */
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textPrimary,
  },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: T.colors.dangerBg,
    borderWidth: 1,
    borderColor: T.colors.dangerBorder,
    borderRadius: T.borderRadius.lg,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.danger,
  },
});
