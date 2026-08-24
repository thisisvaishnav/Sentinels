import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ReportSearchProps {
  value: string;
  onChangeText: (value: string) => void;
}

export default function ReportSearch({ value, onChangeText }: ReportSearchProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder="Search by report ID, citizen, category, location..."
        placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingVertical: 0,
  },
});
