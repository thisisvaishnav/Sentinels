import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  clearNotifications,
  deleteNotification,
  filterNotifications,
  loadEnumeratorNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/src/features/enumeration/data/notifications';
import {
  EnumeratorNotification,
  NotificationFilterCategory,
} from '@/src/features/enumeration/types/notificationTypes';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

// Modular Components
import { NotificationsHeader } from '@/src/features/enumeration/components/notifications/NotificationsHeader';
import { NotificationFilterBar } from '@/src/features/enumeration/components/notifications/NotificationFilterBar';
import { NotificationList } from '@/src/features/enumeration/components/notifications/NotificationList';
import { NotificationLoadingState } from '@/src/features/enumeration/components/notifications/NotificationLoadingState';
import { NotificationErrorState } from '@/src/features/enumeration/components/notifications/NotificationErrorState';

export default function EnumeratorNotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<EnumeratorNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<NotificationFilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchNotifications = useCallback(async () => {
    setIsError(false);
    try {
      const list = await loadEnumeratorNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
  };

  const handlePressItem = async (item: EnumeratorNotification) => {
    if (!item.read) {
      const updated = await markNotificationAsRead(item.id);
      setNotifications(updated);
    }

    if (item.actionRoute) {
      router.push(item.actionRoute as any);
    }
  };

  const handleMarkAllAsRead = async () => {
    const updated = await markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleDeleteItem = async (id: string) => {
    const updated = await deleteNotification(id);
    setNotifications(updated);
  };

  const handleClearAll = async () => {
    const updated = await clearNotifications();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const priorityCount = notifications.filter(
    (n) => n.priority === 'high' || n.priority === 'urgent' || n.type === 'priority'
  ).length;

  const filterCounts: Record<NotificationFilterCategory, number> = {
    All: notifications.length,
    Unread: unreadCount,
    Priority: priorityCount,
    'Blind Spot': notifications.filter((n) => n.type === 'blind-spot').length,
    Anomaly: notifications.filter((n) => n.type === 'anomaly').length,
    Missing: notifications.filter((n) => n.type === 'missing').length,
    Verification: notifications.filter((n) => n.type === 'verification').length,
    System: notifications.filter(
      (n) => n.type === 'system' || n.type === 'sync' || n.type === 'assignment'
    ).length,
  };

  const filteredItems = filterNotifications(notifications, selectedCategory, searchQuery);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Header */}
      <NotificationsHeader
        unreadCount={unreadCount}
        totalCount={notifications.length}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[ENUMERATOR_THEME.colors.accent]}
            tintColor={ENUMERATOR_THEME.colors.accent}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search alerts, dispatches, household ID..."
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} activeOpacity={0.8}>
              <Ionicons name="close-circle" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Chips */}
        <NotificationFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={filterCounts}
        />

        {/* Loading / Error / List State */}
        {isLoading ? (
          <NotificationLoadingState />
        ) : isError ? (
          <NotificationErrorState onRetry={fetchNotifications} />
        ) : (
          <NotificationList
            items={filteredItems}
            category={selectedCategory}
            searchQuery={searchQuery}
            onPressItem={handlePressItem}
            onDelete={handleDeleteItem}
            onClearFilters={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  scrollBody: {
    paddingVertical: 12,
    gap: 14,
  },
  searchWrap: {
    marginHorizontal: 16,
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
  bottomSpacer: {
    height: 32,
  },
});
