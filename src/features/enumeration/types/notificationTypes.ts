export type NotificationType =
  | 'priority'
  | 'blind-spot'
  | 'anomaly'
  | 'missing'
  | 'verification'
  | 'coverage'
  | 'assignment'
  | 'sync'
  | 'survey'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface EnumeratorNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: NotificationPriority;
  householdId?: string;
  areaId?: string;
  actionRoute?: string;
  actionLabel?: string;
}

export type NotificationFilterCategory =
  | 'All'
  | 'Unread'
  | 'Priority'
  | 'Blind Spot'
  | 'Anomaly'
  | 'Missing'
  | 'Verification'
  | 'System';
