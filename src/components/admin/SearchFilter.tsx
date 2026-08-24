import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface SearchFilterProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
}

export default function SearchFilter({ value, onChangeText, onFilterPress }: SearchFilterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Search by name or ID…"
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      <TouchableOpacity style={styles.filterBtn} activeOpacity={0.6} onPress={onFilterPress}>
        <Ionicons name="filter-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
