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
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { EnumeratorProfile } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface EnumeratorDrawerProps {
  visible: boolean;
  onClose: () => void;
  profile: EnumeratorProfile;
}

interface DrawerMenuItem {
  id: string;
  label: string;
  route: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

const MENU_ITEMS: DrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(enumerator)/dashboard', iconName: 'view-dashboard-outline' },
  { id: 'start-survey', label: 'Start Survey', route: '/(enumerator)/start-survey', iconName: 'clipboard-text-outline' },
  { id: 'register-household', label: 'Register Household', route: '/(enumerator)/register-household', iconName: 'home-plus-outline' },
  { id: 'report-missing', label: 'Report Missing Household', route: '/(enumerator)/report-missing', iconName: 'alert-decagram-outline' },
  { id: 'gis-map', label: 'GIS Map', route: '/(enumerator)/gis-map', iconName: 'map-search-outline' },
  { id: 'priority-tasks', label: 'Priority Tasks', route: '/(enumerator)/priority-tasks', iconName: 'shield-alert-outline' },
  { id: 'assigned-zone', label: 'Assigned Zone / Route', route: '/(enumerator)/assigned-zone', iconName: 'map-marker-path' },
  { id: 'notifications', label: 'Notifications', route: '/(enumerator)/notifications', iconName: 'bell-outline' },
  { id: 'profile', label: 'Profile / Settings', route: '/(enumerator)/profile', iconName: 'account-cog-outline' },
];

export const EnumeratorDrawer: React.FC<EnumeratorDrawerProps> = ({
  visible,
  onClose,
  profile,
}) => {
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigate = (route: string) => {
    onClose();
    if (currentPath !== route) {
      router.push(route as any);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop listener to close drawer on outside tap */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Drawer Body */}
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons name="satellite-variant" size={24} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.brandTitle}>LOKVISION</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleNavigate('/(enumerator)/profile')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons name="account-hard-hat" size={24} color={ENUMERATOR_THEME.colors.accent} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileId}>ID: {profile.id}</Text>
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
                  <MaterialCommunityIcons
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
            <Text style={styles.footerAppText}>Lokvision Enumerator v1.0</Text>
            <Text style={styles.footerZoneText}>{profile.assignedZone}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
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
