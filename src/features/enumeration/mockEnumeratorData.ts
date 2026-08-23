import {
  AssignedZoneInfo,
  EnumeratorActivity,
  EnumeratorProfile,
  PriorityTaskMetric,
  QuickActionItem,
  SyncStatusInfo,
  TodayProgress,
} from './types';

export const mockEnumeratorProfile: EnumeratorProfile = {
  id: 'EN-4029',
  name: 'Sarah Jenkins',
  role: 'Lead Field Enumerator',
  assignedZone: 'Ward 12 - Shastri Nagar North',
  isOnline: true,
  unreadNotificationsCount: 3,
};

export const mockTodayProgress: TodayProgress = {
  totalAssigned: 150,
  completed: 102,
  remaining: 48,
  coveragePercentage: 68,
};

export const mockPriorityTasks: PriorityTaskMetric[] = [
  {
    id: 'p1',
    title: 'High-Priority Households',
    count: 8,
    unit: 'urgent surveys',
    iconName: 'home-alert-outline',
    color: '#EF4444',
    badgeBg: '#FEF2F2',
  },
  {
    id: 'p2',
    title: 'Blind-Spot Areas',
    count: 3,
    unit: 'unmapped clusters',
    iconName: 'radar',
    color: '#F59E0B',
    badgeBg: '#FFFBEB',
  },
  {
    id: 'p3',
    title: 'Unverified Households',
    count: 12,
    unit: 'pending GIS check',
    iconName: 'map-marker-question-outline',
    color: '#3B82F6',
    badgeBg: '#EFF6FF',
  },
  {
    id: 'p4',
    title: 'Anomaly Alerts',
    count: 2,
    unit: 'density flags',
    iconName: 'alert-circle-outline',
    color: '#EC4899',
    badgeBg: '#FDF2F8',
  },
];

export const mockAssignedZone: AssignedZoneInfo = {
  zoneName: 'Ward 12 - Shastri Nagar North',
  subArea: 'Sector 4B & 4C Extension',
  totalHouseholds: 450,
  completedHouseholds: 333,
  coveragePercentage: 74,
};

export const mockQuickActions: QuickActionItem[] = [
  {
    id: 'act-survey',
    label: 'Start Survey',
    iconName: 'clipboard-edit-outline',
    color: '#6366F1',
  },
  {
    id: 'act-register',
    label: 'Register Household',
    iconName: 'home-plus-outline',
    color: '#10B981',
  },
  {
    id: 'act-report',
    label: 'Report Missing',
    iconName: 'alert-decagram-outline',
    color: '#F59E0B',
  },
  {
    id: 'act-map',
    label: 'View Map',
    iconName: 'map-search-outline',
    color: '#0EA5E9',
  },
];

export const mockSyncStatus: SyncStatusInfo = {
  pendingCount: 4,
  lastSynced: '10 mins ago',
  isSyncing: false,
};

export const mockRecentActivities: EnumeratorActivity[] = [
  {
    id: 'act-1',
    title: 'Registered Household H-104',
    detail: 'Captured Rajesh Kumar family (5 members) with GPS coordinates.',
    timestamp: '12 mins ago',
    type: 'registered',
  },
  {
    id: 'act-2',
    title: 'Verified Location H-089',
    detail: 'Physical location & water supply connection verified.',
    timestamp: '45 mins ago',
    type: 'verified',
  },
  {
    id: 'act-3',
    title: 'Reported Missing Household',
    detail: 'Flagged unlisted structure near Sector 4B railway track.',
    timestamp: '2 hrs ago',
    type: 'missing',
  },
  {
    id: 'act-4',
    title: 'Batch Data Synchronization',
    detail: 'Successfully synced 18 field records to Lokvision database.',
    timestamp: '3 hrs ago',
    type: 'sync',
  },
];
