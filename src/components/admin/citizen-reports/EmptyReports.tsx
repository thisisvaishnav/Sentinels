import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export default function EmptyReports() {
  return (
    <View style={styles.container}>
      <Ionicons name="megaphone-outline" size={48} color={ENUMERATOR_THEME.colors.textMuted} />
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
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  subtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
});
