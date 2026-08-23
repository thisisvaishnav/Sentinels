import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EnumeratorNotification, NotificationFilterCategory } from '../../types/notificationTypes';
import { NotificationCard } from './NotificationCard';
import { NotificationEmptyState } from './NotificationEmptyState';

interface NotificationListProps {
  items: EnumeratorNotification[];
  category: NotificationFilterCategory;
  searchQuery: string;
  onPressItem: (item: EnumeratorNotification) => void;
  onDelete: (id: string) => void;
  onClearFilters: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  items,
  category,
  searchQuery,
  onPressItem,
  onDelete,
  onClearFilters,
}) => {
  if (items.length === 0) {
    return (
      <NotificationEmptyState
        category={category}
        hasSearchQuery={searchQuery.trim().length > 0}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
          onPressItem={onPressItem}
          onDelete={onDelete}
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
