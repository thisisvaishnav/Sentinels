import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/adminTheme';
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';

interface AdminHeaderProps {
  userName?: string;
  enumeratorId?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

export default function AdminHeader({
  userName = 'Sarah Jenkins',
  enumeratorId = 'EN-4029',
  notificationCount = 3,
  onLogout,
}: AdminHeaderProps) {
  const { toggle } = useAdminDrawer();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: hamburger + logo */}
      <View style={styles.leftRow}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6} onPress={toggle}>
          <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <Ionicons name="business" size={20} color={COLORS.accent} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Lokvision</Text>
          <Text style={styles.subtitle}>{userName} · {enumeratorId}</Text>
        </View>
      </View>

      {/* Right: online badge + bell + logout */}
      <View style={styles.rightRow}>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.6}
          onPress={() => router.push('/(admin)/notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successSoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
