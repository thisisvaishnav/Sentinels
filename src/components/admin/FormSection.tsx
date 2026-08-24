import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.divider,
    marginBottom: 12,
  },
  children: {
    gap: 10,
  },
});
