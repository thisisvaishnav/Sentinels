import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export default function IntroductionCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Field Enumerators</Text>
      <Text style={styles.description}>
        Manage your enumerator workforce, track field coverage, and handle
        real-time updates from survey zones across the city.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
