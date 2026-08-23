import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ZoneHouseholdItem } from '../../types';
import { PriorityTaskCard } from './PriorityTaskCard';
import { PriorityEmptyState } from './PriorityEmptyState';

interface PriorityTaskListProps {
  households: ZoneHouseholdItem[];
  category: string;
  searchQuery: string;
  onClearFilters: () => void;
}

export const PriorityTaskList: React.FC<PriorityTaskListProps> = ({
  households,
  category,
  searchQuery,
  onClearFilters,
}) => {
  if (households.length === 0) {
    return (
      <PriorityEmptyState
        category={category}
        hasSearchQuery={searchQuery.trim().length > 0}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <View style={styles.container}>
      {households.map((item) => (
        <PriorityTaskCard key={item.id} household={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
