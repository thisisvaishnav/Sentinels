import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import AdminLayout from '@/src/components/admin/AdminLayout';
import {
  AdminNotification,
  AdminNotificationFilterCategory,
} from '@/src/components/admin/notifications/adminNotificationTypes';
import { AdminNotificationList } from '@/src/components/admin/notifications/AdminNotificationList';

const SEED_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'a1',
    type: 'survey',
    title: 'New Survey Assigned',
    message: 'Water Access Survey 2024 has been assigned to Ward 12. 48 households pending.',
    timestamp: '2h ago',
    read: false,
    priority: 'high',
    actionLabel: 'View Survey',
  },
  {
    id: 'a2',
    type: 'enumerator',
    title: 'Enumerator Report Submitted',
    message: 'Ravi Kumar has submitted the daily field report for Zone B. 12 households covered.',
    timestamp: '4h ago',
    read: false,
    actionLabel: 'View Report',
  },
  {
    id: 'a3',
    type: 'alert',
    title: 'Low Coverage Alert',
    message: 'Ward 7 coverage dropped below 60%. Immediate attention required.',
    timestamp: '6h ago',
    read: false,
    priority: 'urgent',
    actionLabel: 'Take Action',
  },
  {
    id: 'a4',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'The system will undergo maintenance on Nov 15, 2024 from 02:00 to 04:00 IST.',
    timestamp: '1d ago',
    read: true,
  },
  {
    id: 'a5',
    type: 'survey',
    title: 'Survey Completion Milestone',
    message: 'Sanitation Survey 2024 has reached 75% completion across all assigned zones.',
    timestamp: '1d ago',
    read: true,
    actionLabel: 'View Progress',
  },
  {
    id: 'a6',
    type: 'enumerator',
    title: 'New Enumerator Registration',
    message: 'Priya Sharma has registered and is pending credential approval.',
    timestamp: '2d ago',
    read: true,
    actionLabel: 'Review',
  },
  {
    id: 'a7',
    type: 'alert',
    title: 'Data Sync Issue Detected',
    message: '3 enumerator devices have not synced data in the last 24 hours.',
    timestamp: '2d ago',
    read: true,
    priority: 'medium',
  },
];

const CATEGORIES: AdminNotificationFilterCategory[] = [
  'All',
  'Unread',
  'Surveys',
  'Enumerators',
  'System',
];

const getCategoryCount = (
  notifications: AdminNotification[],
  category: AdminNotificationFilterCategory,
): number => {
  if (category === 'All') return notifications.length;
  if (category === 'Unread') return notifications.filter((n) => !n.read).length;
  if (category === 'Surveys') return notifications.filter((n) => n.type === 'survey').length;
  if (category === 'Enumerators') return notifications.filter((n) => n.type === 'enumerator').length;
  if (category === 'System') return notifications.filter((n) => n.type === 'system').length;
  return 0;
};

export default function AdminNotificationsScreen() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(SEED_ADMIN_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState<AdminNotificationFilterCategory>('All');
  const [searchQuery] = useState('');

  const totalCount = notifications.length;
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const priorityCount = useMemo(
    () => notifications.filter((n) => n.priority === 'urgent' || n.priority === 'high').length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Unread') return !n.read;
      if (selectedCategory === 'Surveys') return n.type === 'survey';
      if (selectedCategory === 'Enumerators') return n.type === 'enumerator';
      if (selectedCategory === 'System') return n.type === 'system';
      return true;
    });
  }, [notifications, selectedCategory]);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handlePressItem = useCallback((item: AdminNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('All');
  }, []);

  return (
    <AdminLayout>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitle}>Survey updates, enumerator alerts & system notices</Text>
          </View>

          <View style={styles.actionsRow}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleMarkAllAsRead}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="email-open-outline"
                  size={18}
                  color={ENUMERATOR_THEME.colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconWrap}>
                <MaterialCommunityIcons name="bell-ring-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
              </View>
              <Text style={[styles.summaryCount, { color: ENUMERATOR_THEME.colors.accent }]}>{totalCount}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="email-alert-outline" size={18} color="#D97706" />
              </View>
              <Text style={[styles.summaryCount, { color: '#D97706' }]}>{unreadCount}</Text>
              <Text style={styles.summaryLabel}>Unread</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={[styles.summaryIconWrap, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="shield-alert-outline" size={18} color="#EF4444" />
              </View>
              <Text style={[styles.summaryCount, { color: '#EF4444' }]}>{priorityCount}</Text>
              <Text style={styles.summaryLabel}>Priority</Text>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getCategoryCount(notifications, cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {cat}
                  </Text>
                  <View style={[styles.chipBadge, isSelected && styles.chipBadgeSelected]}>
                    <Text style={[styles.chipBadgeText, isSelected && styles.chipBadgeTextSelected]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Notification List */}
          <AdminNotificationList
            items={filteredNotifications}
            category={selectedCategory}
            searchQuery={searchQuery}
            onPressItem={handlePressItem}
            onClearFilters={handleClearFilters}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
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
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingTop: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    gap: 6,
  },
  summaryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accentSoft,
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
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipTextSelected: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  chipBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
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
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  chipBadgeTextSelected: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  bottomSpacer: {
    height: 24,
  },
});
