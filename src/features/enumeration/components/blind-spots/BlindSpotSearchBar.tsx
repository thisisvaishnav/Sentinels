import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotSearchBarProps {
  searchQuery: string;
  onChangeSearch: (text: string) => void;
}

export const BlindSpotSearchBar: React.FC<BlindSpotSearchBarProps> = ({
  searchQuery,
  onChangeSearch,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.input}
          placeholder="Search by area name, ID, or locality..."
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={onChangeSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onChangeSearch('')} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 2,
  },
});
