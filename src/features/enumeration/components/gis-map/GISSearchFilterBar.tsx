import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export type StatusFilterOption =
  | 'All'
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Priority'
  | 'Needs Verification'
  | 'Missing';

export type AreaFilterOption =
  | 'All Areas'
  | 'Canal Side'
  | 'Station Road'
  | 'Shiv Nagar West'
  | 'Shiv Nagar East';

interface GISSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedStatus: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  selectedArea: AreaFilterOption;
  onAreaChange: (area: AreaFilterOption) => void;
  areaNames: string[];
}

const STATUS_OPTIONS: StatusFilterOption[] = [
  'All',
  'Pending',
  'In Progress',
  'Completed',
  'Priority',
  'Needs Verification',
  'Missing',
];

export const GISSearchFilterBar: React.FC<GISSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedArea,
  onAreaChange,
  areaNames,
}) => {
  const availableAreas: AreaFilterOption[] = [
    'All Areas',
    ...areaNames.map((a) => a as AreaFilterOption),
  ];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ID, Head Name, Locality..."
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {STATUS_OPTIONS.map((opt) => {
          const isActive = selectedStatus === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, isActive && styles.activeChip]}
              onPress={() => onStatusChange(opt)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Area Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {availableAreas.map((area) => {
          const isActive = selectedArea === area;
          return (
            <TouchableOpacity
              key={area}
              style={[styles.areaChip, isActive && styles.activeAreaChip]}
              onPress={() => onAreaChange(area)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location-outline"
                size={13}
                color={isActive ? ENUMERATOR_THEME.colors.textWhite : ENUMERATOR_THEME.colors.textMuted}
              />
              <Text style={[styles.areaChipText, isActive && styles.activeAreaChipText]}>
                {area}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
    padding: 0,
  },
  chipRow: {
    gap: 6,
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  activeChip: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderColor: ENUMERATOR_THEME.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  activeChipText: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  activeAreaChip: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  areaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
  activeAreaChipText: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
