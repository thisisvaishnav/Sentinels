import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface PrioritySearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const PrioritySearchBar: React.FC<PrioritySearchBarProps> = ({
  value,
  onChangeText,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by ID, name, locality, address..."
        placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={onClear} activeOpacity={0.8}>
          <Ionicons name="close-circle" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  clearBtn: {
    padding: 2,
  },
});
