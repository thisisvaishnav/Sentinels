import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface CitizenDrawerProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userId?: string;
}

interface DrawerMenuItem {
  id: string;
  label: string;
  route: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: DrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(citizen)/dashboard', iconName: 'home-outline' },
  { id: 'household', label: 'My Household', route: '/(citizen)/household', iconName: 'home-outline' },
  { id: 'schemes', label: 'Government Schemes', route: '/(citizen)/schemes', iconName: 'newspaper-outline' },
  { id: 'report-need', label: 'Report a Need', route: '/(citizen)/report-need', iconName: 'megaphone-outline' },
  { id: 'progress', label: 'My Progress', route: '/(citizen)/progress', iconName: 'stats-chart-outline' },
  { id: 'notifications', label: 'Notifications', route: '/(citizen)/notifications', iconName: 'notifications-outline' },
  { id: 'support', label: 'Support / FAQ', route: '/(citizen)/support', iconName: 'help-circle-outline' },
];

export default function CitizenDrawer({
  visible,
  onClose,
  userName = 'Citizen',
  userId = '',
}: CitizenDrawerProps) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigate = (route: string) => {
    onClose();
    if (currentPath !== route) {
      router.push(route as any);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <Ionicons name="shield-checkmark" size={24} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.brandTitle}>DRISHTI</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleNavigate('/(citizen)/dashboard')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{getInitials(userName)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              {userId ? <Text style={styles.profileId}>ID: {userId}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>

          {/* Navigation Menu */}
          <ScrollView contentContainerStyle={styles.menuList} showsVerticalScrollIndicator={false}>
            {MENU_ITEMS.map((item) => {
              const isActive = currentPath === item.route;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleNavigate(item.route)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.iconName}
                    size={22}
                    color={isActive ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
                  />
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Info */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerAppText}>DRISHTI Citizen v1.0</Text>
            <Text style={styles.footerZoneText}>Civic Engagement Portal</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 42, 58, 0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRightWidth: 1,
    borderRightColor: ENUMERATOR_THEME.colors.border,
    paddingTop: 44,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  profileId: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  menuList: {
    gap: 6,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
    flex: 1,
  },
  menuTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  drawerFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    gap: 2,
  },
  footerAppText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  footerZoneText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '600',
  },
});
