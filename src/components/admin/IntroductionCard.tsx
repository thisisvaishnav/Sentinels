import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

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
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
});
