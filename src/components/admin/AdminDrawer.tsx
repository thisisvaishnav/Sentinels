import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '@/src/features/auth/authService';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

const MENU_ITEMS = [
  { label: 'Home', icon: 'home-outline' as const, route: '/(admin)/dashboard' },
  { label: 'Surveys', icon: 'document-text-outline' as const, route: '/(admin)/survey-management' },
  { label: 'Enumerators', icon: 'people-outline' as const, route: '/(admin)/field-enumerators' },
  { label: 'Citizen Reports', icon: 'megaphone-outline' as const, route: '/(admin)/citizen-reports' },
  { label: 'Settings', icon: 'settings-outline' as const, route: null },
] as const;

export default function AdminDrawer() {
  const { isOpen, close } = useAdminDrawer();
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim]);

  const handleItemPress = (route: string | null) => {
    close();
    if (route && pathname !== route) {
      router.push(route as any);
    }
  };

  const handleLogout = () => {
    close();
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('admin_logged_in');
            await signOut();
          } catch {
            // signOut already cleaned up locally
          }
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const isActive = (route: string | null) => {
    if (!route) return false;
    return pathname === route;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Drawer header */}
        <View style={styles.drawerHeader}>
          <View style={styles.drawerHeaderTop}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>AP</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} activeOpacity={0.6} onPress={close}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.drawerTitle}>DRISHTI</Text>
          <Text style={styles.drawerSubtitle}>Admin Panel</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            const active = isActive(item.route);
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, active && styles.menuItemActive]}
                activeOpacity={0.6}
                onPress={() => handleItemPress(item.route)}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textSecondary}
                />
                <Text
                  style={[styles.menuLabel, active && styles.menuLabelActive]}
                >
                  {item.label}
                </Text>
                {!item.route && (
                  <Text style={styles.comingSoon}>Soon</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout at bottom */}
        <View style={styles.drawerFooter}>
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.6}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={ENUMERATOR_THEME.colors.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  drawerHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  avatarLargeText: {
    fontSize: 18,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.primary,
    letterSpacing: 0.4,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 2,
  },
  menuList: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
    borderRightWidth: 3,
    borderRightColor: ENUMERATOR_THEME.colors.accent,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textSecondary,
    flex: 1,
  },
  menuLabelActive: {
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  comingSoon: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
    padding: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.danger,
  },
});
