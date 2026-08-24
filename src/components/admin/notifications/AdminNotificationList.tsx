import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdminNotification, AdminNotificationFilterCategory } from './adminNotificationTypes';
import { AdminNotificationCard } from './AdminNotificationCard';
import { AdminNotificationEmptyState } from './AdminNotificationEmptyState';

interface AdminNotificationListProps {
  items: AdminNotification[];
  category: AdminNotificationFilterCategory;
  searchQuery: string;
  onPressItem: (item: AdminNotification) => void;
  onClearFilters: () => void;
}

export const AdminNotificationList: React.FC<AdminNotificationListProps> = ({
  items,
  category,
  searchQuery,
  onPressItem,
  onClearFilters,
}) => {
  if (items.length === 0) {
    return (
      <AdminNotificationEmptyState
        category={category}
        hasSearchQuery={searchQuery.trim().length > 0}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <AdminNotificationCard
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
