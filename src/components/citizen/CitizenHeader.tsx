import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface CitizenHeaderProps {
  onOpenDrawer: () => void;
  userName?: string;
}

export default function CitizenHeader({ onOpenDrawer, userName = 'Citizen' }: CitizenHeaderProps) {
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      {/* Left: hamburger */}
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6} onPress={onOpenDrawer}>
        <Ionicons name="menu" size={24} color={ENUMERATOR_THEME.colors.textPrimary} />
      </TouchableOpacity>

      {/* Centre: title */}
      <View style={styles.titleRow}>
        <Ionicons name="shield-checkmark" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.title}>DRISHTI</Text>
      </View>

      {/* Right: bell + avatar */}
      <View style={styles.rightRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.6}
          onPress={() => router.push('/(citizen)/notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
          <View style={styles.dot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.6}>
          <Text style={styles.avatarText}>{getInitials(userName)}</Text>
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
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.primary,
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
    backgroundColor: ENUMERATOR_THEME.colors.dot,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
