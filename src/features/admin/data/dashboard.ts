import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdminProfile,
  PriorityTaskMetric,
  QuickActionItem,
  SyncStatusInfo,
  EnumeratorActivity,
  TodayProgress,
  AssignedZoneInfo,
} from '../types';
import { loadEnumeratorHouseholds, getDerivedZoneMetrics } from '@/src/features/enumeration/data/households';
import { loadEnumeratorActivity, filterTodayActivities, deriveWorkBreakdownMetrics } from '@/src/features/enumeration/data/activity';
import { ZoneHouseholdItem, EnumeratorActivityLog, WorkBreakdownMetrics } from '@/src/features/enumeration/types';

export const ADMIN_DASHBOARD_STORAGE_KEY = '@lokvision_admin_dashboard';

export interface AdminDashboardData {
  profile: AdminProfile;
  priorityTasks: PriorityTaskMetric[];
  quickActions: QuickActionItem[];
  syncStatus: SyncStatusInfo;
  recentActivities: EnumeratorActivity[];
}

export const mockAdminProfile: AdminProfile = {
  id: 'ADM-001',
  name: 'Sarah Jenkins',
  role: 'Zone Administrator',
  assignedZone: 'Zone A-12 · Ward 12 (Shiv Nagar)',
  isOnline: true,
  unreadNotificationsCount: 5,
};

export const mockAdminPriorityTasks: PriorityTaskMetric[] = [
  {
    id: 'ap1',
    title: 'High-Priority Households',
    count: 8,
    unit: 'urgent surveys',
    iconName: 'home-alert-outline',
    color: '#D32F2F',
    badgeBg: '#FFEBEE',
  },
  {
    id: 'ap2',
    title: 'Blind-Spot Areas',
    count: 3,
    unit: 'unmapped clusters',
    iconName: 'radar',
    color: '#FF6D00',
    badgeBg: '#FFF3E0',
  },
  {
    id: 'ap3',
    title: 'Unverified Households',
    count: 5,
    unit: 'pending review',
    iconName: 'map-marker-question-outline',
    color: '#1976D2',
    badgeBg: '#E3F2FD',
  },
  {
    id: 'ap4',
    title: 'Anomaly Alerts',
    count: 2,
    unit: 'density flags',
    iconName: 'alert-circle-outline',
    color: '#D32F2F',
    badgeBg: '#FFEBEE',
  },
];

export const mockAdminQuickActions: QuickActionItem[] = [
  {
    id: 'admin-act-reports',
    label: 'View Reports',
    iconName: 'chart-bar',
    color: '#2962FF',
    route: '/(admin)/survey-management',
  },
  {
    id: 'admin-act-enumerators',
    label: 'Manage Enumerators',
    iconName: 'account-group-outline',
    color: '#2E7D32',
    route: '/(admin)/field-enumerators',
  },
  {
    id: 'admin-act-surveys',
    label: 'Survey Settings',
    iconName: 'clipboard-edit-outline',
    color: '#FF6D00',
    route: '/(admin)/survey-management',
  },
  {
    id: 'admin-act-map',
    label: 'View Map',
    iconName: 'map-search-outline',
    color: '#1976D2',
    route: '/(admin)/dashboard',
  },
];

export const mockAdminSyncStatus: SyncStatusInfo = {
  pendingCount: 0,
  lastSynced: '2 mins ago',
  isSyncing: false,
};

export const mockAdminRecentActivities: EnumeratorActivity[] = [
  {
    id: 'admin-act-1',
    title: 'Survey Completed LV-UP-000124',
    detail: 'Captured Rajesh Kumar family (5 members) with GPS coordinates.',
    timestamp: '10:42 AM',
    type: 'registered',
  },
  {
    id: 'admin-act-2',
    title: 'Household Marked High Priority',
    detail: 'Flagged Sunita Devi household for urgent ration assistance.',
    timestamp: '10:15 AM',
    type: 'verified',
  },
  {
    id: 'admin-act-3',
    title: 'New Household Registered',
    detail: 'Added Pooja Sharma household in Shiv Nagar West.',
    timestamp: '09:48 AM',
    type: 'missing',
  },
  {
    id: 'admin-act-4',
    title: 'Batch Data Synchronization',
    detail: 'Successfully synced local field records to local storage.',
    timestamp: '09:21 AM',
    type: 'sync',
  },
];

export async function loadAdminDashboard(): Promise<AdminDashboardData> {
  try {
    const json = await AsyncStorage.getItem(ADMIN_DASHBOARD_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {
    // Ignore read error
  }
  const defaults = {
    profile: mockAdminProfile,
    priorityTasks: mockAdminPriorityTasks,
    quickActions: mockAdminQuickActions,
    syncStatus: mockAdminSyncStatus,
    recentActivities: mockAdminRecentActivities,
  };
  await saveAdminDashboard(defaults);
  return defaults;
}

export async function saveAdminDashboard(data: AdminDashboardData): Promise<void> {
  try {
    await AsyncStorage.setItem(ADMIN_DASHBOARD_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore save error
  }
}

export function getAdminDerivedMetrics(): {
  todayProgress: TodayProgress;
  assignedZoneInfo: AssignedZoneInfo;
} {
  const assigned = 14;
  const completed = 5;
  const remaining = assigned - completed;
  const coveragePercentage = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

  return {
    todayProgress: {
      totalAssigned: assigned,
      completed,
      remaining,
      coveragePercentage,
    },
    assignedZoneInfo: {
      zoneName: 'Zone A-12 · Ward 12',
      subArea: 'Shiv Nagar (East & West)',
      totalHouseholds: assigned,
      completedHouseholds: completed,
      coveragePercentage,
    },
  };
}

export interface AdminTodayProgressSummary {
  zoneMetrics: ReturnType<typeof getDerivedZoneMetrics>;
  todayActivities: EnumeratorActivityLog[];
  earlierActivities: EnumeratorActivityLog[];
  workBreakdown: WorkBreakdownMetrics;
  allHouseholds: ZoneHouseholdItem[];
}

export async function getAdminTodayProgressSummary(): Promise<AdminTodayProgressSummary> {
  const households = await loadEnumeratorHouseholds();
  const activities = await loadEnumeratorActivity();

  const zoneMetrics = getDerivedZoneMetrics(households);
  const { today: todayActivities, earlier: earlierActivities } = filterTodayActivities(activities);
  const workBreakdown = deriveWorkBreakdownMetrics(activities, true);

  return {
    zoneMetrics,
    todayActivities,
    earlierActivities,
    workBreakdown,
    allHouseholds: households,
  };
}
