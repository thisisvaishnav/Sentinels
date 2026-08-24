export type AdminNotificationType =
  | 'enumerator-alert'
  | 'report-update'
  | 'survey-assignment'
  | 'verification-needed'
  | 'coverage-warning'
  | 'system';

export type AdminNotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: AdminNotificationPriority;
  enumeratorId?: string;
  areaId?: string;
  actionRoute?: string;
  actionLabel?: string;
}

export type AdminNotificationFilterCategory =
  | 'All'
  | 'Unread'
  | 'Priority'
  | 'Enumerator'
  | 'Reports'
  | 'System';
