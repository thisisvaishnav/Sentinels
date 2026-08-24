import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

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
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
    letterSpacing: 0.3,
  },
});
