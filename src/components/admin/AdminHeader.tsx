import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { useAdminDrawer } from '@/src/contexts/AdminDrawerContext';

export default function AdminHeader() {
  const { toggle } = useAdminDrawer();

  return (
    <View style={styles.container}>
      {/* Left: hamburger */}
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6} onPress={toggle}>
        <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* Centre: title */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>DRISHTI</Text>
      </View>

      {/* Right: bell + avatar */}
      <View style={styles.rightRow}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          <View style={styles.dot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.6}>
          <Text style={styles.avatarText}>AP</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dot,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
