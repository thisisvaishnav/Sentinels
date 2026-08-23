import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

export default function FieldEnumeratorsHeader() {
  return (
    <View style={styles.container}>
      {/* Centre: title */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>DRISHTI</Text>
        <Text style={styles.subtitle}>Admin</Text>
      </View>

      {/* Right: bell */}
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
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
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
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
