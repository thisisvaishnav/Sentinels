export type CitizenNotificationType =
  | 'scheme'
  | 'update'
  | 'alert';

export type CitizenNotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CitizenNotification {
  id: string;
  type: CitizenNotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: CitizenNotificationPriority;
  actionRoute?: string;
  actionLabel?: string;
}

export type CitizenNotificationFilterCategory =
  | 'All'
  | 'Unread'
  | 'Schemes'
  | 'Updates'
  | 'Alerts';
