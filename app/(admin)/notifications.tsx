import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/adminTheme';
import {
  clearNotifications,
  deleteNotification,
  filterNotifications,
  loadAdminNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/src/features/admin/data/notifications';
import {
  AdminNotification,
  AdminNotificationFilterCategory,
} from '@/src/features/admin/types/notificationTypes';

const CATEGORIES: AdminNotificationFilterCategory[] = [
  'All',
  'Unread',
  'Priority',
  'Enumerator',
  'Reports',
  'System',
];

const TYPE_ICONS: Record<string, { name: string; color: string; bg: string }> = {
  'enumerator-alert': { name: 'account-alert-outline', color: '#EF4444', bg: '#FEE2E2' },
  'report-update': { name: 'file-document-outline', color: '#F59E0B', bg: '#FEF3C7' },
  'survey-assignment': { name: 'clipboard-edit-outline', color: '#3B82F6', bg: '#DBEAFE' },
  'verification-needed': { name: 'shield-alert-outline', color: '#8B5CF6', bg: '#F3E8FF' },
  'coverage-warning': { name: 'radar', color: '#EC4899', bg: '#FDF2F8' },
  system: { name: 'cog-outline', color: '#64748B', bg: '#F1F5F9' },
};

export default function AdminNotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AdminNotificationFilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = useCallback(async () => {
    setIsError(false);
    try {
      const list = await loadAdminNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
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

  const handlePressItem = async (item: AdminNotification) => {
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

  const handleClearAllConfirm = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all admin notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: handleClearAll },
      ]
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const priorityCount = notifications.filter(
    (n) => n.priority === 'high' || n.priority === 'urgent'
  ).length;

  const filterCounts: Record<AdminNotificationFilterCategory, number> = {
    All: notifications.length,
    Unread: unreadCount,
    Priority: priorityCount,
    Enumerator: notifications.filter(
      (n) => n.type === 'enumerator-alert' || n.type === 'verification-needed'
    ).length,
    Reports: notifications.filter(
      (n) => n.type === 'report-update' || n.type === 'survey-assignment'
    ).length,
    System: notifications.filter(
      (n) => n.type === 'system' || n.type === 'coverage-warning'
    ).length,
  };

  const filteredItems = filterNotifications(notifications, selectedCategory, searchQuery);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>Admin alerts, reports & system updates</Text>
        </View>

        <View style={styles.actionsRow}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleMarkAllAsRead}
              activeOpacity={0.8}
              accessibilityLabel="Mark all as read"
            >
              <MaterialCommunityIcons
                name="email-open-outline"
                size={18}
                color={COLORS.accent}
              />
            </TouchableOpacity>
          )}

          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={handleClearAllConfirm}
              activeOpacity={0.8}
              accessibilityLabel="Clear all notifications"
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
      >
        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScroll}
        >
          {[
            {
              id: 'All' as AdminNotificationFilterCategory,
              label: 'All',
              count: filterCounts.All,
              icon: 'bell-ring-outline' as const,
              color: COLORS.accent,
              bg: COLORS.accentSoft,
            },
            {
              id: 'Unread' as AdminNotificationFilterCategory,
              label: 'Unread',
              count: filterCounts.Unread,
              icon: 'email-alert-outline' as const,
              color: '#D97706',
              bg: '#FEF3C7',
            },
            {
              id: 'Priority' as AdminNotificationFilterCategory,
              label: 'Priority',
              count: filterCounts.Priority,
              icon: 'shield-alert-outline' as const,
              color: '#EF4444',
              bg: '#FEE2E2',
            },
          ].map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.summaryCard, isSelected && styles.summaryCardSelected]}
                onPress={() => setSelectedCategory(c.id)}
                activeOpacity={0.8}
              >
                <View style={styles.summaryTopRow}>
                  <View style={[styles.summaryIconWrap, { backgroundColor: c.bg }]}>
                    <MaterialCommunityIcons name={c.icon} size={18} color={c.color} />
                  </View>
                  <Text style={[styles.summaryCount, { color: c.color }]}>{c.count}</Text>
                </View>
                <Text style={styles.summaryLabel}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notifications, enumerator ID..."
            placeholderTextColor={COLORS.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} activeOpacity={0.8}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Chips */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = filterCounts[cat] || 0;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{cat}</Text>
                  <View style={[styles.chipBadge, isSelected && styles.chipBadgeSelected]}>
                    <Text style={[styles.chipBadgeText, isSelected && styles.chipBadgeTextSelected]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : isError ? (
          /* Error State */
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={36} color={COLORS.danger} />
            <Text style={styles.errorTitle}>Unable to load notifications</Text>
            <Text style={styles.errorSubtitle}>An error occurred while loading notification records.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchNotifications} activeOpacity={0.8}>
              <Ionicons name="refresh" size={14} color="#FFFFFF" />
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name={
                searchQuery
                  ? 'magnify-remove-outline'
                  : selectedCategory === 'Unread'
                  ? 'email-check-outline'
                  : 'bell-sleep-outline'
              }
              size={36}
              color={COLORS.textMuted}
            />
            <Text style={styles.emptyTitle}>
              {searchQuery
                ? 'No matching notifications found'
                : selectedCategory === 'All'
                ? "You're all caught up!"
                : selectedCategory === 'Unread'
                ? 'No unread notifications'
                : `No ${selectedCategory.toLowerCase()} notifications`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try adjusting your search terms or selecting another category.'
                : 'New admin alerts, report updates, and system notices will appear here.'}
            </Text>
            {(searchQuery || selectedCategory !== 'All') && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={14} color={COLORS.accent} />
                <Text style={styles.resetBtnText}>Reset Search & Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Notification List */
          filteredItems.map((item) => {
            const iconConfig = TYPE_ICONS[item.type] || TYPE_ICONS.system;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !item.read && styles.unreadCard]}
                onPress={() => handlePressItem(item)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeftGroup}>
                    <View style={[styles.cardIconWrap, { backgroundColor: iconConfig.bg }]}>
                      <MaterialCommunityIcons
                        name={iconConfig.name as any}
                        size={18}
                        color={iconConfig.color}
                      />
                    </View>
                    <View style={styles.cardTitleWrap}>
                      <View style={styles.cardTitleRow}>
                        {!item.read && <View style={styles.unreadDot} />}
                        <Text style={styles.cardTitle}>{item.title}</Text>
                      </View>
                      <Text style={styles.cardTimestamp}>{item.timestamp}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.cardDeleteBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-outline" size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.cardMessage}>{item.message}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.tagsGroup}>
                    {(item.priority === 'urgent' || item.priority === 'high') && (
                      <Text style={styles.priorityBadge}>HIGH PRIORITY</Text>
                    )}
                    {item.enumeratorId && (
                      <View style={styles.ctxBadge}>
                        <Text style={styles.ctxBadgeText}>{item.enumeratorId}</Text>
                      </View>
                    )}
                    {item.areaId && (
                      <View style={styles.ctxBadge}>
                        <Text style={styles.ctxBadgeText}>{item.areaId}</Text>
                      </View>
                    )}
                  </View>
                  {item.actionLabel && (
                    <View style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>{item.actionLabel}</Text>
                      <Ionicons name="chevron-forward" size={12} color={COLORS.accent} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  unreadBadge: {
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accent,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrollBody: {
    paddingVertical: 12,
    gap: 14,
  },
  summaryScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  summaryCard: {
    width: 140,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  summaryCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentSoft,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  searchWrap: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  clearBtn: {
    padding: 2,
  },
  filterBar: {
    paddingVertical: 2,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.textOnPrimary,
  },
  chipBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  chipBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  chipBadgeTextSelected: {
    color: COLORS.textOnPrimary,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  errorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  errorSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginHorizontal: 16,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cardTimestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardDeleteBtn: {
    padding: 4,
  },
  cardMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ctxBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctxBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
  bottomSpacer: {
    height: 32,
  },
});
