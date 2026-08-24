import {
  TodayProgress,
  AssignedZoneInfo,
  PriorityTaskMetric,
  QuickActionItem,
  SyncStatusInfo,
  EnumeratorActivity,
} from '@/src/features/enumeration/types';

export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  assignedZone: string;
  isOnline: boolean;
  unreadNotificationsCount: number;
}

export type {
  TodayProgress,
  AssignedZoneInfo,
  PriorityTaskMetric,
  QuickActionItem,
  SyncStatusInfo,
  EnumeratorActivity,
};
