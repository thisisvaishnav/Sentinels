import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

export default function EmptyReports() {
  return (
    <View style={styles.container}>
      <Ionicons name="megaphone-outline" size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>No citizen reports found</Text>
      <Text style={styles.subtitle}>
        Try adjusting your filters or search terms.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
