import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

interface AcknowledgementBadgeProps {
  acknowledged: number;
  total: number;
}

export default function AcknowledgementBadge({
  acknowledged,
  total,
}: AcknowledgementBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {acknowledged}/{total} STAFF ACKNOWLEDGED
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});
