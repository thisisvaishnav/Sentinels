import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface DrishtiHeaderProps {
  onNotificationsPress?: () => void;
}

export default function DrishtiHeader({ onNotificationsPress }: DrishtiHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: avatar + title */}
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AP</Text>
        </View>
        <Text style={styles.title}>DRISHTI</Text>
      </View>

      {/* Right: bell icon */}
      <TouchableOpacity
        style={styles.iconBtn}
        activeOpacity={0.6}
        onPress={onNotificationsPress}
      >
        <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
        <View style={styles.dot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    height: 58,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
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
});
