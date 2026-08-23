import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import FilterPickerModal from './FilterPickerModal';

interface FilterState {
  zone: string;
  enumerator: string;
  priority: string;
  category: string;
  status: string;
}

interface ReportFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  zoneOptions: string[];
  enumeratorOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  statusOptions: string[];
}

export default function ReportFilters({
  filters,
  onFilterChange,
  zoneOptions,
  enumeratorOptions,
  priorityOptions,
  categoryOptions,
  statusOptions,
}: ReportFiltersProps) {
  const [activePicker, setActivePicker] = useState<keyof FilterState | null>(null);

  const handleSelect = (key: keyof FilterState, value: string) => {
    onFilterChange(key, value);
    setActivePicker(null);
  };

  const getDisplayLabel = (key: keyof FilterState): string => {
    const value = filters[key];
    if (!value.startsWith('All')) return value;
    return value;
  };

  const isFiltered = (key: keyof FilterState): boolean => {
    return !filters[key].startsWith('All');
  };

  return (
    <View style={styles.container}>
      <FilterButton
        label="Zone"
        displayLabel={getDisplayLabel('zone')}
        filtered={isFiltered('zone')}
        onPress={() => setActivePicker('zone')}
      />
      <FilterButton
        label="Enumerator"
        displayLabel={getDisplayLabel('enumerator')}
        filtered={isFiltered('enumerator')}
        onPress={() => setActivePicker('enumerator')}
      />
      <FilterButton
        label="Priority"
        displayLabel={getDisplayLabel('priority')}
        filtered={isFiltered('priority')}
        onPress={() => setActivePicker('priority')}
      />
      <FilterButton
        label="Category"
        displayLabel={getDisplayLabel('category')}
        filtered={isFiltered('category')}
        onPress={() => setActivePicker('category')}
      />
      <FilterButton
        label="Status"
        displayLabel={getDisplayLabel('status')}
        filtered={isFiltered('status')}
        onPress={() => setActivePicker('status')}
      />

      {/* Picker Modals */}
      <FilterPickerModal
        visible={activePicker === 'zone'}
        title="Select Zone"
        options={zoneOptions}
        selectedValue={filters.zone}
        onSelect={(v) => handleSelect('zone', v)}
        onClose={() => setActivePicker(null)}
      />
      <FilterPickerModal
        visible={activePicker === 'enumerator'}
        title="Select Enumerator"
        options={enumeratorOptions}
        selectedValue={filters.enumerator}
        onSelect={(v) => handleSelect('enumerator', v)}
        onClose={() => setActivePicker(null)}
      />
      <FilterPickerModal
        visible={activePicker === 'priority'}
        title="Select Priority"
        options={priorityOptions}
        selectedValue={filters.priority}
        onSelect={(v) => handleSelect('priority', v)}
        onClose={() => setActivePicker(null)}
      />
      <FilterPickerModal
        visible={activePicker === 'category'}
        title="Select Category"
        options={categoryOptions}
        selectedValue={filters.category}
        onSelect={(v) => handleSelect('category', v)}
        onClose={() => setActivePicker(null)}
      />
      <FilterPickerModal
        visible={activePicker === 'status'}
        title="Select Status"
        options={statusOptions}
        selectedValue={filters.status}
        onSelect={(v) => handleSelect('status', v)}
        onClose={() => setActivePicker(null)}
      />
    </View>
  );
}

function FilterButton({
  label,
  displayLabel,
  filtered,
  onPress,
}: {
  label: string;
  displayLabel: string;
  filtered: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.filterBtn, filtered && styles.filterBtnActive]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <Text style={[styles.filterLabel, filtered && styles.filterLabelActive]}>
        {displayLabel}
      </Text>
      <Ionicons
        name="chevron-down"
        size={12}
        color={filtered ? COLORS.accent : COLORS.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  filterBtnActive: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterLabelActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});
