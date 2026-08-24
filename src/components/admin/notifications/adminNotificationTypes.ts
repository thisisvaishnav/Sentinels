export type AdminNotificationType =
  | 'survey'
  | 'enumerator'
  | 'system'
  | 'alert';

export type AdminNotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: AdminNotificationPriority;
  actionRoute?: string;
  actionLabel?: string;
}

export type AdminNotificationFilterCategory =
  | 'All'
  | 'Unread'
  | 'Surveys'
  | 'Enumerators'
  | 'System';
