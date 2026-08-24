import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EnumeratorNotification,
  NotificationFilterCategory,
} from '../types/notificationTypes';
import { loadEnumeratorHouseholds } from './households';
import { loadMissingReports } from './missingReports';

export const NOTIFICATIONS_STORAGE_KEY = '@lokvision_enumerator_notifications';

export const INITIAL_NOTIFICATIONS_SEED: EnumeratorNotification[] = [
  {
    id: 'notif-101',
    type: 'priority',
    title: 'High Priority Field Work',
    message: '12 households in Canal Side remain pending survey completion.',
    timestamp: 'Today, 08:30 AM',
    read: false,
    priority: 'high',
    areaId: 'Canal Side',
    actionRoute: '/(enumerator)/priority-tasks?category=High%20Priority',
    actionLabel: 'Open Tasks',
  },
  {
    id: 'notif-102',
    type: 'blind-spot',
    title: 'Blind Spot Coverage Alert',
    message: 'Low coverage detected in Canal Side. Current coverage is at 28%.',
    timestamp: 'Today, 09:15 AM',
    read: false,
    priority: 'urgent',
    areaId: 'Canal Side',
    actionRoute: '/(enumerator)/gis-map?focus=blind-spot',
    actionLabel: 'View Area',
  },
  {
    id: 'notif-103',
    type: 'anomaly',
    title: 'GPS Location Mismatch Anomaly',
    message: 'Household LV-UP-000127 has a location mismatch that requires field verification.',
    timestamp: 'Today, 09:45 AM',
    read: false,
    priority: 'high',
    householdId: 'LV-UP-000127',
    actionRoute: '/(enumerator)/anomalies',
    actionLabel: 'Review',
  },
  {
    id: 'notif-104',
    type: 'missing',
    title: 'Missing Household Filed',
    message: 'Missing household report submitted for LV-UP-000124 (House Locked).',
    timestamp: 'Yesterday, 04:20 PM',
    read: true,
    priority: 'medium',
    householdId: 'LV-UP-000124',
    actionRoute: '/(enumerator)/report-missing',
    actionLabel: 'View Report',
  },
  {
    id: 'notif-105',
    type: 'verification',
    title: 'Household Verification Required',
    message: 'Household LV-UP-000131 requires verification check before supervisor sign-off.',
    timestamp: 'Yesterday, 02:10 PM',
    read: false,
    priority: 'high',
    householdId: 'LV-UP-000131',
    actionRoute: '/(enumerator)/verification',
    actionLabel: 'Verify Household',
  },
  {
    id: 'notif-106',
    type: 'coverage',
    title: 'Zone Milestone Reached',
    message: 'Zone A-12 coverage reached 68%. Great progress on field enumeration!',
    timestamp: 'Yesterday, 11:00 AM',
    read: true,
    priority: 'low',
    actionRoute: '/(enumerator)/assigned-zone',
    actionLabel: 'View Zone',
  },
  {
    id: 'notif-107',
    type: 'assignment',
    title: 'Zone Assignment Update',
    message: 'Supervisor Dr. R. K. Sharma added 4 new unmapped structures to Shiv Nagar West.',
    timestamp: '2 days ago',
    read: true,
    priority: 'medium',
    areaId: 'Shiv Nagar West',
    actionRoute: '/(enumerator)/assigned-zone',
    actionLabel: 'View Assignment',
  },
  {
    id: 'notif-108',
    type: 'sync',
    title: 'Local Sync Pending',
    message: '3 locally saved household survey records are waiting to sync with central database.',
    timestamp: '2 days ago',
    read: true,
    priority: 'medium',
    actionRoute: '/(enumerator)/dashboard',
    actionLabel: 'Sync Now',
  },
  {
    id: 'notif-109',
    type: 'survey',
    title: 'Survey Saved as Draft',
    message: 'Draft survey saved for Household LV-UP-000137 (Head: Vikram Malhotra).',
    timestamp: '3 days ago',
    read: true,
    priority: 'low',
    householdId: 'LV-UP-000137',
    actionRoute: '/(enumerator)/start-survey',
    actionLabel: 'Continue Survey',
  },
  {
    id: 'notif-110',
    type: 'system',
    title: 'System Notice: App Updated',
    message: 'Lokvision Enumerator v1.0.4 patch applied. Offline caching stability improved.',
    timestamp: '4 days ago',
    read: true,
    priority: 'low',
    actionRoute: '/(enumerator)/profile',
    actionLabel: 'View Details',
  },
];

/**
 * Load notifications from AsyncStorage or return derived seed data.
 */
export async function loadEnumeratorNotifications(): Promise<EnumeratorNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed: EnumeratorNotification[] = JSON.parse(raw);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }

  // Derive dynamic notifications from households and missing reports
  const derived = await generateDerivedNotifications();
  const initialList = [...derived, ...INITIAL_NOTIFICATIONS_SEED];
  await saveEnumeratorNotifications(initialList);
  return initialList;
}

/**
 * Persist notifications list to AsyncStorage.
 */
export async function saveEnumeratorNotifications(
  notifications: EnumeratorNotification[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(
  id: string
): Promise<EnumeratorNotification[]> {
  const current = await loadEnumeratorNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  await saveEnumeratorNotifications(updated);
  return updated;
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsAsRead(): Promise<EnumeratorNotification[]> {
  const current = await loadEnumeratorNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  await saveEnumeratorNotifications(updated);
  return updated;
}

/**
 * Delete a single notification.
 */
export async function deleteNotification(
  id: string
): Promise<EnumeratorNotification[]> {
  const current = await loadEnumeratorNotifications();
  const updated = current.filter((n) => n.id !== id);
  await saveEnumeratorNotifications(updated);
  return updated;
}

/**
 * Clear all notifications.
 */
export async function clearNotifications(): Promise<EnumeratorNotification[]> {
  await saveEnumeratorNotifications([]);
  return [];
}

/**
 * Generate real derived notifications based on current households & missing reports.
 */
async function generateDerivedNotifications(): Promise<EnumeratorNotification[]> {
  const derived: EnumeratorNotification[] = [];

  try {
    const households = await loadEnumeratorHouseholds();
    const missingReports = await loadMissingReports();

    // Derived 1: Missing report submitted
    if (missingReports.length > 0) {
      const latest = missingReports[0];
      derived.push({
        id: `derived-missing-${latest.reportId}`,
        type: 'missing',
        title: 'Missing Report Active',
        message: `Field report filed for ${latest.householdId || latest.locality} (${latest.reason}).`,
        timestamp: latest.visitDate ? `Filed ${latest.visitDate}` : 'Recently filed',
        read: false,
        priority: latest.priority === 'High' || latest.priority === 'Urgent' ? 'high' : 'medium',
        householdId: latest.householdId,
        actionRoute: '/(enumerator)/report-missing',
        actionLabel: 'View Report',
      });
    }

    // Derived 2: Unverified households check
    const unverified = households.filter(
      (h) => h.verificationStatus === 'Needs Verification'
    );
    if (unverified.length > 0) {
      derived.push({
        id: 'derived-verification-summary',
        type: 'verification',
        title: 'Pending Verification Check',
        message: `${unverified.length} households in your zone require field verification review.`,
        timestamp: 'Active Field Alert',
        read: false,
        priority: 'high',
        actionRoute: '/(enumerator)/priority-tasks?category=Needs%20Verification',
        actionLabel: 'Verify Households',
      });
    }
  } catch (err) {
    console.error('Error generating derived notifications:', err);
  }

  return derived;
}

/**
 * Filter notifications by category and optional query.
 */
export function filterNotifications(
  notifications: EnumeratorNotification[],
  category: NotificationFilterCategory = 'All',
  query: string = ''
): EnumeratorNotification[] {
  const searchQuery = query.trim().toLowerCase();

  return notifications.filter((item) => {
    // Category match
    let matchesCategory = true;
    if (category === 'Unread') {
      matchesCategory = !item.read;
    } else if (category === 'Priority') {
      matchesCategory = item.priority === 'high' || item.priority === 'urgent' || item.type === 'priority';
    } else if (category === 'Blind Spot') {
      matchesCategory = item.type === 'blind-spot';
    } else if (category === 'Anomaly') {
      matchesCategory = item.type === 'anomaly';
    } else if (category === 'Missing') {
      matchesCategory = item.type === 'missing';
    } else if (category === 'Verification') {
      matchesCategory = item.type === 'verification';
    } else if (category === 'System') {
      matchesCategory = item.type === 'system' || item.type === 'sync' || item.type === 'assignment';
    }

    if (!matchesCategory) return false;

    // Search query match
    if (!searchQuery) return true;

    const matchTitle = item.title.toLowerCase().includes(searchQuery);
    const matchMessage = item.message.toLowerCase().includes(searchQuery);
    const matchHousehold = item.householdId ? item.householdId.toLowerCase().includes(searchQuery) : false;

    return matchTitle || matchMessage || matchHousehold;
  });
}
