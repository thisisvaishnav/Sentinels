import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface SurveyFiltersProps {
  zones: string[];
  staff: string[];
  statusFilter: string;
  onZoneChange: (value: string) => void;
  onStaffChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SurveyFilters({
  zones,
  staff,
  statusFilter,
  onZoneChange,
  onStaffChange,
  onStatusChange,
}: SurveyFiltersProps) {
  return (
    <View style={styles.container}>
      <FilterDropdown
        label="Zone"
        options={['All Zones', ...zones]}
        value={statusFilter}
        onSelect={onZoneChange}
      />
      <FilterDropdown
        label="Staff"
        options={['All Staff', ...staff]}
        value={statusFilter}
        onSelect={onStaffChange}
      />
      <FilterDropdown
        label="Status"
        options={['All Status', 'Completed', 'In Progress', 'Pending']}
        value={statusFilter}
        onSelect={onStatusChange}
      />
    </View>
  );
}

function FilterDropdown({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View style={styles.selectBox}>
        <Text style={styles.selectText} numberOfLines={1}>
          {value || options[0]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginBottom: 4,
  },
  selectBox: {
    height: 36,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
