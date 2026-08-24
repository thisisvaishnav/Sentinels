import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CitizenNotification,
  CitizenNotificationFilterCategory,
} from '@/src/components/citizen/notifications/citizenNotificationTypes';
import { CitizenNotificationList } from '@/src/components/citizen/notifications/CitizenNotificationList';

const SEED_CITIZEN_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: 'c1',
    type: 'scheme',
    title: 'New Scheme: PM Ujjwala Yojana',
    message: 'You may be eligible for the PM Ujjwala Yojana LPG connection scheme. Check your eligibility now.',
    timestamp: '1h ago',
    read: false,
    priority: 'high',
    actionLabel: 'Check Eligibility',
  },
  {
    id: 'c2',
    type: 'update',
    title: 'Household Verification Complete',
    message: 'Your household details have been successfully verified by the regional team.',
    timestamp: '3h ago',
    read: false,
  },
  {
    id: 'c3',
    type: 'alert',
    title: 'Document Expiring Soon',
    message: 'Your Aadhaar card verification expires in 30 days. Please renew to continue availing benefits.',
    timestamp: '5h ago',
    read: false,
    priority: 'medium',
    actionLabel: 'Renew Now',
  },
  {
    id: 'c4',
    type: 'scheme',
    title: 'Scheme Match: PM Awas Yojana',
    message: 'Based on your profile, you match the criteria for PM Awas Yojana housing benefits.',
    timestamp: '1d ago',
    read: true,
    actionLabel: 'Apply Now',
  },
  {
    id: 'c5',
    type: 'update',
    title: 'Survey Submission Received',
    message: 'Thank you for participating in the community water infrastructure survey.',
    timestamp: '2d ago',
    read: true,
  },
  {
    id: 'c6',
    type: 'scheme',
    title: 'New Scheme: Ayushman Bharat',
    message: 'Ayushman Bharat health insurance scheme is now available in your district.',
    timestamp: '3d ago',
    read: true,
    actionLabel: 'Learn More',
  },
  {
    id: 'c7',
    type: 'alert',
    title: 'Account Security Update',
    message: 'We recommend enabling two-factor authentication for added security.',
    timestamp: '4d ago',
    read: true,
  },
];

const CATEGORIES: CitizenNotificationFilterCategory[] = [
  'All',
  'Unread',
  'Schemes',
  'Updates',
  'Alerts',
];

const getCategoryCount = (
  notifications: CitizenNotification[],
  category: CitizenNotificationFilterCategory,
): number => {
  if (category === 'All') return notifications.length;
  if (category === 'Unread') return notifications.filter((n) => !n.read).length;
  if (category === 'Schemes') return notifications.filter((n) => n.type === 'scheme').length;
  if (category === 'Updates') return notifications.filter((n) => n.type === 'update').length;
  if (category === 'Alerts') return notifications.filter((n) => n.type === 'alert').length;
  return 0;
};

export default function CitizenNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<CitizenNotification[]>(SEED_CITIZEN_NOTIFICATIONS);
  const [selectedCategory, setSelectedCategory] = useState<CitizenNotificationFilterCategory>('All');
  const [searchQuery] = useState('');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Unread') return !n.read;
      if (selectedCategory === 'Schemes') return n.type === 'scheme';
      if (selectedCategory === 'Updates') return n.type === 'update';
      if (selectedCategory === 'Alerts') return n.type === 'alert';
      return true;
    });
  }, [notifications, selectedCategory]);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handlePressItem = useCallback((item: CitizenNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('All');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={AppColors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.headerAction}
            onPress={handleMarkAllAsRead}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done-outline" size={20} color={AppColors.blue} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
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
        <CitizenNotificationList
          items={filteredNotifications}
          category={selectedCategory}
          searchQuery={searchQuery}
          onPressItem={handlePressItem}
          onClearFilters={handleClearFilters}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.bgMain,
    marginTop: -30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: AppColors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: AppColors.blue,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: AppColors.textWhite,
  },
  headerAction: {
    padding: 6,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingTop: 14,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: AppColors.blue,
    borderColor: AppColors.blue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppColors.textSecondary,
  },
  chipTextSelected: {
    color: AppColors.textWhite,
  },
  chipBadge: {
    backgroundColor: AppColors.bgSubtle,
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
    color: AppColors.textPrimary,
  },
  chipBadgeTextSelected: {
    color: AppColors.textWhite,
  },
  bottomSpacer: {
    height: 24,
  },
});
