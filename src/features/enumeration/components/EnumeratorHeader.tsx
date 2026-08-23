import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EnumeratorProfile } from '../types';
import { signOut } from '@/src/features/auth/authService';
import { ENUMERATOR_THEME } from '../theme';

interface EnumeratorHeaderProps {
  profile: EnumeratorProfile;
  onOpenDrawer?: () => void;
}

export const EnumeratorHeader: React.FC<EnumeratorHeaderProps> = ({ profile, onOpenDrawer }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/onboarding');
    } catch {
      router.replace('/onboarding');
    }
  };

  const handleNotificationPress = () => {
    router.push('/(enumerator)/notifications');
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* Hamburger Menu Button */}
        {onOpenDrawer && (
          <TouchableOpacity style={styles.menuBtn} onPress={onOpenDrawer} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={24} color={ENUMERATOR_THEME.colors.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.brandIconBox}>
          <MaterialCommunityIcons name="satellite-variant" size={22} color={ENUMERATOR_THEME.colors.accent} />
        </View>
        <View>
          <Text style={styles.brandName}>Lokvision</Text>
          <Text style={styles.roleSub}>{profile.name} · {profile.id}</Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        {/* Status Indicator */}
        <View style={[styles.statusPill, profile.isOnline ? styles.onlinePill : styles.offlinePill]}>
          <View style={[styles.statusDot, profile.isOnline ? styles.onlineDot : styles.offlineDot]} />
          <Text style={[styles.statusText, profile.isOnline ? styles.onlineText : styles.offlineText]}>
            {profile.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleNotificationPress} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
          {profile.unreadNotificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.unreadNotificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleSignOut} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={20} color={ENUMERATOR_THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 66,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    letterSpacing: 0.2,
  },
  roleSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 5,
  },
  onlinePill: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  offlinePill: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onlineDot: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  offlineDot: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  onlineText: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  offlineText: {
    color: ENUMERATOR_THEME.colors.warningText,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: ENUMERATOR_THEME.colors.danger,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 9,
    fontWeight: '800',
  },
});
