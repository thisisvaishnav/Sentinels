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

export interface DrawerMenuItem {
  id: string;
  label: string;
  route: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface DrawerUserProfile {
  name: string;
  id: string;
  zone?: string;
}

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  menuItems: DrawerMenuItem[];
  profile: DrawerUserProfile;
  branding?: string;
  version?: string;
  onLogout?: () => void;
}

export function SideDrawer({
  visible,
  onClose,
  menuItems,
  profile,
  branding = 'DRISHTI',
  version = 'v1.0',
  onLogout,
}: SideDrawerProps) {
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
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <MaterialCommunityIcons
                name="satellite-variant"
                size={24}
                color="#0284C7"
              />
              <Text style={styles.brandTitle}>{branding}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleNavigate(menuItems[0]?.route || '/')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrap}>
              <MaterialCommunityIcons name="account" size={24} color="#0284C7" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileId}>ID: {profile.id}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Navigation Menu */}
          <ScrollView contentContainerStyle={styles.menuList} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => {
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
                    color={isActive ? '#0284C7' : '#64748B'}
                  />
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                    {item.label}
                  </Text>
                  {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Sign Out */}
          {onLogout && (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={onLogout}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="logout" size={22} color="#DC2626" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          )}

          {/* Footer Info */}
          <View style={styles.drawerFooter}>
            <Text style={styles.footerAppText}>Drishti {version}</Text>
            {profile.zone && (
              <Text style={styles.footerZoneText}>{profile.zone}</Text>
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
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
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
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#172A3A',
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
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172A3A',
  },
  profileId: {
    fontSize: 11,
    color: '#64748B',
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
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555D66',
    flex: 1,
  },
  menuTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  drawerFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    gap: 2,
  },
  footerAppText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  footerZoneText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
  },
});
