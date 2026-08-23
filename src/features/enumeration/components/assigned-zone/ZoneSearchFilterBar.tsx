import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export type ZoneFilterType =
  | 'All'
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Priority'
  | 'Needs Verification'
  | 'Urgent Needs'
  | 'Missing';

export type ZoneSortType =
  | 'Priority first'
  | 'Pending first'
  | 'Lowest coverage area first'
  | 'Household ID';

interface Props {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: ZoneFilterType;
  onFilterChange: (filter: ZoneFilterType) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  activeSort: ZoneSortType;
  onSortChange: (sort: ZoneSortType) => void;
}

const FILTERS: ZoneFilterType[] = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Priority',
  'Needs Verification',
  'Urgent Needs',
  'Missing',
];

const AREAS = [
  'All Areas',
  'Canal Side',
  'Station Road',
  'Shiv Nagar West',
  'Shiv Nagar East',
];

const SORTS: ZoneSortType[] = [
  'Priority first',
  'Pending first',
  'Lowest coverage area first',
  'Household ID',
];

export function ZoneSearchFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  selectedArea,
  onAreaChange,
  activeSort,
  onSortChange,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search household ID, name, or locality..."
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

      {/* Area Filter Scroll */}
      <View style={styles.areaRow}>
        <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.filterGroupLabel}>Area:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {AREAS.map((a) => {
            const isActive = selectedArea === a;
            return (
              <TouchableOpacity
                key={a}
                style={[styles.areaChip, isActive && styles.areaChipActive]}
                onPress={() => onAreaChange(a)}
                activeOpacity={0.7}
              >
                <Text style={[styles.areaChipText, isActive && styles.areaChipTextActive]}>{a}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Status / Category Filter Chips Scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onFilterChange(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort Option Control */}
      <View style={styles.sortRow}>
        <Ionicons name="swap-vertical-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
          {SORTS.map((s) => {
            const isSelected = activeSort === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.sortChip, isSelected && styles.sortChipSelected]}
                onPress={() => onSortChange(s)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sortChipText, isSelected && styles.sortChipTextSelected]}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
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
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  chipsScroll: {
    gap: 6,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterGroupLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  areaChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  areaChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  areaChipText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  areaChipTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontWeight: '800',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  sortScroll: {
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  sortChipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  sortChipText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  sortChipTextSelected: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
});
