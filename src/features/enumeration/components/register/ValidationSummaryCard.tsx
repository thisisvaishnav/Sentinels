import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export interface ValidationErrorItem {
  id: string;
  field: string;
  sectionKey: string;
}

interface Props {
  errors: ValidationErrorItem[];
  onItemPress?: (sectionKey: string) => void;
}

export function ValidationSummaryCard({ errors, onItemPress }: Props) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="alert-circle" size={22} color={ENUMERATOR_THEME.colors.danger} />
        <Text style={styles.title}>
          {errors.length} {errors.length === 1 ? 'item needs' : 'items need'} attention
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Please complete the following required fields before submitting:
      </Text>

      <View style={styles.errorsList}>
        {errors.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.errorRow}
            onPress={() => onItemPress?.(item.sectionKey)}
            activeOpacity={0.7}
          >
            <View style={styles.bullet} />
            <Text style={styles.errorLabel}>{item.field}</Text>
            <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.danger} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEF2F2',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  subtitle: {
    fontSize: 12,
    color: '#B91C1C',
  },
  errorsList: {
    gap: 6,
    marginTop: 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.danger,
  },
  errorLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
});
