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
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';
import { COLORS } from '@/constants/adminTheme';

interface AdminDrawerMenuItem {
  id: string;
  label: string;
  route: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

const ADMIN_MENU_ITEMS: AdminDrawerMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/(admin)/dashboard', iconName: 'view-dashboard-outline' },
  { id: 'surveys', label: 'Surveys', route: '/(admin)/survey-management', iconName: 'clipboard-text-outline' },
  { id: 'enumerators', label: 'Enumerators', route: '/(admin)/field-enumerators', iconName: 'account-group-outline' },
  { id: 'citizen-reports', label: 'Citizen Reports', route: '/(admin)/citizen-reports', iconName: 'bullhorn-outline' },
  { id: 'notifications', label: 'Notifications', route: '/(admin)/notifications', iconName: 'bell-outline' },
  { id: 'settings', label: 'Settings', route: '/(admin)/dashboard', iconName: 'cog-outline' },
];

interface AdminDrawerProps {
  profile?: {
    name: string;
    id: string;
    zone?: string;
  };
}

export default function AdminDrawer({ profile }: AdminDrawerProps) {
  const { isOpen, close } = useAdminDrawer();
  const router = useRouter();
  const currentPath = usePathname();

  const userProfile = profile || {
    name: 'Admin',
    id: 'ADM-001',
    zone: 'All Zones',
  };

  const handleNavigate = (route: string) => {
    close();
    if (currentPath !== route) {
      router.push(route as any);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.overlay}>
        {/* Backdrop listener to close drawer on outside tap */}
        <TouchableWithoutFeedback onPress={close}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Drawer Body */}
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons
                name="satellite-variant"
                size={24}
                color={COLORS.accent}
              />
              <Text style={styles.brandTitle}>DRISHTI</Text>
            </View>
            <TouchableOpacity onPress={close} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleNavigate('/(admin)/dashboard')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons name="shield-account" size={24} color={COLORS.accent} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileId}>ID: {userProfile.id}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          {/* Navigation Menu */}
          <ScrollView contentContainerStyle={styles.menuList} showsVerticalScrollIndicator={false}>
            {ADMIN_MENU_ITEMS.map((item) => {
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
                    color={isActive ? COLORS.accent : COLORS.textMuted}
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
            <Text style={styles.footerAppText}>DRISHTI Admin v1.0</Text>
            {userProfile.zone && (
              <Text style={styles.footerZoneText}>{userProfile.zone}</Text>
            )}
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
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
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
    borderBottomColor: COLORS.divider,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileId: {
    fontSize: 11,
    color: COLORS.textMuted,
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
    borderRadius: 10,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  menuTextActive: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  drawerFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    alignItems: 'center',
    gap: 2,
  },
  footerAppText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  footerZoneText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '600',
  },
});
