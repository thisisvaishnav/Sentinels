import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  remarks: string;
  onChange: (text: string) => void;
}

export function EnumeratorRemarksCard({ remarks, onChange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="notebook-edit-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Enumerator Remarks</Text>
      </View>

      <TextInput
        style={styles.multilineInput}
        placeholder="Add any important household observations..."
        placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
        multiline
        numberOfLines={3}
        value={remarks}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  multilineInput: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 72,
    fontSize: 13,
  },
});
