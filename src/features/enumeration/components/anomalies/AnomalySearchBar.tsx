import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { AnomalySortOption } from '../../types/anomalyTypes';

interface AnomalySearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  sortOption: AnomalySortOption;
  onSelectSort: (sort: AnomalySortOption) => void;
}

export const AnomalySearchBar: React.FC<AnomalySearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  sortOption,
  onSelectSort,
}) => {
  const nextSort = (): AnomalySortOption => {
    if (sortOption === 'Severity') return 'Household ID';
    if (sortOption === 'Household ID') return 'Area';
    return 'Severity';
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search household ID, head name, area, anomaly..."
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.8}>
            <Ionicons name="close-circle" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.sortBtn}
        onPress={() => onSelectSort(nextSort())}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="sort" size={16} color={ENUMERATOR_THEME.colors.textPrimary} />
        <Text style={styles.sortText}>{sortOption}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrap: {
    flex: 1,
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
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  clearBtn: {
    padding: 2,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 10,
    height: 40,
    gap: 4,
  },
  sortText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
