import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/adminTheme';
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';

interface AdminHeaderProps {
  userName?: string;
  adminId?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

export default function AdminHeader({
  userName = 'Admin User',
  adminId = 'ADM-001',
  notificationCount = 3,
  onLogout,
}: AdminHeaderProps) {
  const { toggle } = useAdminDrawer();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* Hamburger Menu Button */}
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.brandIconBox}>
          <MaterialCommunityIcons name="satellite-variant" size={22} color={COLORS.accent} />
        </View>
        <View>
          <Text style={styles.brandName}>LOKEVISION</Text>
          <Text style={styles.roleSub}>{userName} · {adminId}</Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        {/* Status Indicator */}
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push('/(admin)/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.iconBtn} onPress={onLogout} activeOpacity={0.7}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 66,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  roleSub: {
    fontSize: 11,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.textOnPrimary,
    fontSize: 9,
    fontWeight: '800',
  },
});
