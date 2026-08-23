import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

const TABS = [
  { label: 'Home', icon: 'home-outline' as const, iconActive: 'home' as const },
  { label: 'Survey', icon: 'document-text-outline' as const, iconActive: 'document-text' as const },
  { label: 'Staff', icon: 'people-outline' as const, iconActive: 'people' as const },
  { label: 'Reports', icon: 'bar-chart-outline' as const, iconActive: 'bar-chart' as const },
  { label: 'More', icon: 'ellipsis-horizontal-outline' as const, iconActive: 'ellipsis-horizontal' as const },
];

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  onNavigate?: (screen: string) => void;
}

export default function BottomNavigation({ activeTab = 'Home', onTabPress }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.label;
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            activeOpacity={0.6}
            onPress={() => onTabPress?.(tab.label)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? COLORS.tabBarActive : COLORS.tabBarInactive}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 4,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.tabBarInactive,
  },
  labelActive: {
    fontWeight: '700',
    color: COLORS.tabBarActive,
  },
});
