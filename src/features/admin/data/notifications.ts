import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdminNotification,
  AdminNotificationFilterCategory,
} from '../types/notificationTypes';

const NOTIFICATIONS_STORAGE_KEY = '@lokvision_admin_notifications';

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'admin-notif-001',
    type: 'enumerator-alert',
    title: 'Enumerator Off-Routine Alert',
    message: 'Enumerator EN-4029 (Rahul Verma) has not checked in for 3 hours during active shift.',
    timestamp: 'Today, 10:15 AM',
    read: false,
    priority: 'high',
    enumeratorId: 'EN-4029',
    actionRoute: '/(admin)/enumerator-command-center',
    actionLabel: 'View Enumerator',
  },
  {
    id: 'admin-notif-002',
    type: 'report-update',
    title: 'Critical Citizen Report Filed',
    message: 'New high-priority citizen report #CR-1089 regarding infrastructure damage in Ward 12.',
    timestamp: 'Today, 09:42 AM',
    read: false,
    priority: 'urgent',
    areaId: 'Ward 12',
    actionRoute: '/(admin)/citizen-reports',
    actionLabel: 'Review Report',
  },
  {
    id: 'admin-notif-003',
    type: 'survey-assignment',
    title: 'Survey Deadline Approaching',
    message: '15 households in Zone A-7 have pending surveys due by end of day tomorrow.',
    timestamp: 'Today, 08:30 AM',
    read: false,
    priority: 'high',
    areaId: 'Zone A-7',
    actionRoute: '/(admin)/survey-management',
    actionLabel: 'Manage Surveys',
  },
  {
    id: 'admin-notif-004',
    type: 'coverage-warning',
    title: 'Low Coverage Zone Detected',
    message: 'Shiv Nagar West coverage has dropped to 22%. Immediate field attention recommended.',
    timestamp: 'Yesterday, 04:30 PM',
    read: true,
    priority: 'medium',
    areaId: 'Shiv Nagar West',
    actionRoute: '/(admin)/field-enumerators',
    actionLabel: 'Assign Enumerators',
  },
  {
    id: 'admin-notif-005',
    type: 'verification-needed',
    title: 'Data Verification Required',
    message: '23 household surveys from EN-4032 require admin verification before submission.',
    timestamp: 'Yesterday, 02:15 PM',
    read: true,
    priority: 'medium',
    enumeratorId: 'EN-4032',
    actionRoute: '/(admin)/field-enumerators',
    actionLabel: 'Verify Data',
  },
  {
    id: 'admin-notif-006',
    type: 'enumerator-alert',
    title: 'Enumerator Shift Completed',
    message: 'Enumerator EN-4015 (Priya Sharma) has completed shift with 12 surveys submitted.',
    timestamp: 'Yesterday, 06:00 PM',
    read: true,
    priority: 'low',
    enumeratorId: 'EN-4015',
    actionRoute: '/(admin)/enumerator-command-center',
    actionLabel: 'View Summary',
  },
  {
    id: 'admin-notif-007',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Database maintenance window tonight from 11 PM to 1 AM. Data sync may be delayed.',
    timestamp: '2 days ago',
    read: true,
    priority: 'low',
    actionRoute: '/(admin)/dashboard',
    actionLabel: 'View Details',
  },
  {
    id: 'admin-notif-008',
    type: 'report-update',
    title: 'Report Assignment Update',
    message: 'Citizen report #CR-1076 has been reassigned to Field Supervisor Dr. R.K. Sharma.',
    timestamp: '3 days ago',
    read: true,
    priority: 'low',
    actionRoute: '/(admin)/citizen-reports',
    actionLabel: 'View Report',
  },
];

export async function loadAdminNotifications(): Promise<AdminNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Error loading admin notifications:', error);
  }

  await saveAdminNotifications(INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

export async function saveAdminNotifications(
  notifications: AdminNotification[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving admin notifications:', error);
  }
}

export async function markNotificationAsRead(
  id: string
): Promise<AdminNotification[]> {
  const current = await loadAdminNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  await saveAdminNotifications(updated);
  return updated;
}

export async function markAllNotificationsAsRead(): Promise<AdminNotification[]> {
  const current = await loadAdminNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  await saveAdminNotifications(updated);
  return updated;
}

export async function deleteNotification(
  id: string
): Promise<AdminNotification[]> {
  const current = await loadAdminNotifications();
  const updated = current.filter((n) => n.id !== id);
  await saveAdminNotifications(updated);
  return updated;
}

export async function clearNotifications(): Promise<AdminNotification[]> {
  await saveAdminNotifications([]);
  return [];
}

export function filterNotifications(
  notifications: AdminNotification[],
  category: AdminNotificationFilterCategory = 'All',
  query: string = ''
): AdminNotification[] {
  const searchQuery = query.trim().toLowerCase();

  return notifications.filter((item) => {
    let matchesCategory = true;
    if (category === 'Unread') {
      matchesCategory = !item.read;
    } else if (category === 'Priority') {
      matchesCategory = item.priority === 'high' || item.priority === 'urgent';
    } else if (category === 'Enumerator') {
      matchesCategory = item.type === 'enumerator-alert' || item.type === 'verification-needed';
    } else if (category === 'Reports') {
      matchesCategory = item.type === 'report-update' || item.type === 'survey-assignment';
    } else if (category === 'System') {
      matchesCategory = item.type === 'system' || item.type === 'coverage-warning';
    }

    if (!matchesCategory) return false;

    if (!searchQuery) return true;

    const matchTitle = item.title.toLowerCase().includes(searchQuery);
    const matchMessage = item.message.toLowerCase().includes(searchQuery);
    const matchEnumerator = item.enumeratorId
      ? item.enumeratorId.toLowerCase().includes(searchQuery)
      : false;

    return matchTitle || matchMessage || matchEnumerator;
  });
}
