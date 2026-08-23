import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export type SurveyFilterType = 'All' | 'Pending' | 'In Progress' | 'Completed' | 'Priority';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: SurveyFilterType;
  onFilterChange: (filter: SurveyFilterType) => void;
}

const FILTERS: SurveyFilterType[] = ['All', 'Pending', 'In Progress', 'Completed', 'Priority'];

export function SurveySearchFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, name, or address..."
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips Scroll View */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onFilterChange(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  filterScroll: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  chipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '800',
  },
});
