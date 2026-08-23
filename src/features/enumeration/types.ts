export interface EnumeratorProfile {
  id: string;
  name: string;
  role: string;
  assignedZone: string;
  isOnline: boolean;
  unreadNotificationsCount: number;
}

export interface TodayProgress {
  totalAssigned: number;
  completed: number;
  remaining: number;
  coveragePercentage: number;
}

export interface PriorityTaskMetric {
  id: string;
  title: string;
  count: number;
  unit: string;
  iconName: string;
  color: string;
  badgeBg: string;
}

export interface AssignedZoneInfo {
  zoneName: string;
  subArea: string;
  totalHouseholds: number;
  completedHouseholds: number;
  coveragePercentage: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  color: string;
  route?: string;
}

export interface SyncStatusInfo {
  pendingCount: number;
  lastSynced: string;
  isSyncing: boolean;
}

export interface EnumeratorActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'registered' | 'verified' | 'missing' | 'sync';
}
