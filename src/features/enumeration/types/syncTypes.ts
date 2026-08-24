export type SyncEntityType =
  | 'household'
  | 'survey'
  | 'missing_report'
  | 'verification'
  | 'activity'
  | 'notification'
  | 'anomaly_escalation';

export type SyncOperation = 'create' | 'update' | 'delete';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  operation: SyncOperation;
  recordId: string;
  payload: unknown;
  status: SyncStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  lastAttemptAt?: string;
  lastError?: string;
}

export interface SyncMetadata {
  lastSuccessfulSyncAt?: string;
  lastAttemptAt?: string;
  currentStatus: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  totalProcessed: number;
}

export interface SyncQueueStats {
  totalCount: number;
  pendingCount: number;
  syncingCount: number;
  syncedCount: number;
  failedCount: number;
  lastSyncedText: string;
  isOnline: boolean;
}
