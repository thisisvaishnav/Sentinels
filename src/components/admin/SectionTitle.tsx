import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
