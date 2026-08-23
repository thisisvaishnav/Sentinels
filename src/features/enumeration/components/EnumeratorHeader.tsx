import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { EnumeratorProfile } from '../types';
import { signOut } from '@/src/features/auth/authService';

interface EnumeratorHeaderProps {
  profile: EnumeratorProfile;
}

export const EnumeratorHeader: React.FC<EnumeratorHeaderProps> = ({ profile }) => {
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
    Alert.alert(
      'Notifications',
      `You have ${profile.unreadNotificationsCount} new field alerts.`
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.brandIconBox}>
          <MaterialCommunityIcons name="satellite-variant" size={22} color="#38BDF8" />
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
          <Ionicons name="notifications-outline" size={22} color="#CBD5E1" />
          {profile.unreadNotificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile.unreadNotificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.iconBtn} onPress={handleSignOut} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 66,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.2,
  },
  roleSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  onlinePill: {
    backgroundColor: '#064E3B',
  },
  offlinePill: {
    backgroundColor: '#451A03',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onlineDot: {
    backgroundColor: '#34D399',
  },
  offlineDot: {
    backgroundColor: '#F59E0B',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  onlineText: {
    color: '#A7F3D0',
  },
  offlineText: {
    color: '#FDE68A',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
