import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CitizenNotification, CitizenNotificationFilterCategory } from './citizenNotificationTypes';
import { CitizenNotificationCard } from './CitizenNotificationCard';
import { CitizenNotificationEmptyState } from './CitizenNotificationEmptyState';

interface CitizenNotificationListProps {
  items: CitizenNotification[];
  category: CitizenNotificationFilterCategory;
  searchQuery: string;
  onPressItem: (item: CitizenNotification) => void;
  onClearFilters: () => void;
}

export const CitizenNotificationList: React.FC<CitizenNotificationListProps> = ({
  items,
  category,
  searchQuery,
  onPressItem,
  onClearFilters,
}) => {
  if (items.length === 0) {
    return (
      <CitizenNotificationEmptyState
        category={category}
        hasSearchQuery={searchQuery.trim().length > 0}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <CitizenNotificationCard
          key={item.id}
          item={item}
          onPressItem={onPressItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
