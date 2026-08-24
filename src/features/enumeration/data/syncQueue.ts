import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SyncEntityType,
  SyncMetadata,
  SyncOperation,
  SyncQueueItem,
  SyncQueueStats,
  SyncStatus,
} from '../types/syncTypes';

export const SYNC_QUEUE_STORAGE_KEY = '@lokvision_sync_queue';
export const SYNC_METADATA_STORAGE_KEY = '@lokvision_sync_metadata';

const DEFAULT_METADATA: SyncMetadata = {
  currentStatus: 'ONLINE',
  totalProcessed: 0,
};

/**
 * Load all items from the sync queue in AsyncStorage.
 */
export async function loadSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: SyncQueueItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load sync queue from AsyncStorage:', error);
    return [];
  }
}

/**
 * Save sync queue items to AsyncStorage.
 */
export async function saveSyncQueue(queue: SyncQueueItem[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error('Failed to save sync queue to AsyncStorage:', error);
    return false;
  }
}

/**
 * Load sync metadata (last sync time, total processed count).
 */
export async function loadSyncMetadata(): Promise<SyncMetadata> {
  try {
    const raw = await AsyncStorage.getItem(SYNC_METADATA_STORAGE_KEY);
    if (!raw) return DEFAULT_METADATA;
    const parsed: SyncMetadata = JSON.parse(raw);
    return { ...DEFAULT_METADATA, ...parsed };
  } catch (error) {
    console.error('Failed to load sync metadata:', error);
    return DEFAULT_METADATA;
  }
}

/**
 * Save sync metadata to AsyncStorage.
 */
export async function saveSyncMetadata(metadata: Partial<SyncMetadata>): Promise<boolean> {
  try {
    const existing = await loadSyncMetadata();
    const updated = { ...existing, ...metadata };
    await AsyncStorage.setItem(SYNC_METADATA_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save sync metadata:', error);
    return false;
  }
}

/**
 * Enqueue a new sync item or update an existing pending item (deduplication).
 */
export async function enqueueSyncItem(
  entityType: SyncEntityType,
  operation: SyncOperation,
  recordId: string,
  payload: unknown
): Promise<SyncQueueItem> {
  const queue = await loadSyncQueue();
  const now = new Date().toISOString();

  // Deduplication check: If an item for the same entity and recordId exists with status 'pending', update payload instead of duplicating
  const existingIdx = queue.findIndex(
    (item) =>
      item.entityType === entityType &&
      item.recordId === recordId &&
      (item.status === 'pending' || item.status === 'failed')
  );

  let targetItem: SyncQueueItem;

  if (existingIdx >= 0) {
    targetItem = {
      ...queue[existingIdx],
      operation,
      payload,
      status: 'pending',
      updatedAt: now,
      lastError: undefined,
    };
    queue[existingIdx] = targetItem;
  } else {
    targetItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entityType,
      operation,
      recordId,
      payload,
      status: 'pending',
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    queue.push(targetItem);
  }

  await saveSyncQueue(queue);
  return targetItem;
}

/**
 * Update a specific queue item (e.g. set status, retry count, or last error).
 */
export async function updateSyncItem(
  id: string,
  updates: Partial<SyncQueueItem>
): Promise<SyncQueueItem[]> {
  const queue = await loadSyncQueue();
  const now = new Date().toISOString();
  const updatedQueue = queue.map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: now } : item
  );
  await saveSyncQueue(updatedQueue);
  return updatedQueue;
}

/**
 * Remove an item from the queue.
 */
export async function removeSyncItem(id: string): Promise<SyncQueueItem[]> {
  const queue = await loadSyncQueue();
  const filtered = queue.filter((item) => item.id !== id);
  await saveSyncQueue(filtered);
  return filtered;
}

/**
 * Get all items matching pending or failed status ready for processing.
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  const queue = await loadSyncQueue();
  return queue.filter((item) => item.status === 'pending' || item.status === 'failed');
}

/**
 * Get failed items.
 */
export async function getFailedSyncItems(): Promise<SyncQueueItem[]> {
  const queue = await loadSyncQueue();
  return queue.filter((item) => item.status === 'failed');
}

/**
 * Clear all items marked as synced.
 */
export async function clearCompletedSyncItems(): Promise<SyncQueueItem[]> {
  const queue = await loadSyncQueue();
  const remaining = queue.filter((item) => item.status !== 'synced');
  await saveSyncQueue(remaining);
  return remaining;
}

/**
 * Compute dynamic queue stats.
 */
export async function getSyncQueueStats(): Promise<SyncQueueStats> {
  const queue = await loadSyncQueue();
  const metadata = await loadSyncMetadata();

  const totalCount = queue.length;
  const pendingCount = queue.filter((item) => item.status === 'pending').length;
  const syncingCount = queue.filter((item) => item.status === 'syncing').length;
  const syncedCount = queue.filter((item) => item.status === 'synced').length;
  const failedCount = queue.filter((item) => item.status === 'failed').length;

  let lastSyncedText = 'Never';
  if (metadata.lastSuccessfulSyncAt) {
    const syncDate = new Date(metadata.lastSuccessfulSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - syncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      lastSyncedText = 'Just now';
    } else if (diffMins < 60) {
      lastSyncedText = `${diffMins} mins ago`;
    } else {
      lastSyncedText = syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  return {
    totalCount,
    pendingCount,
    syncingCount,
    syncedCount,
    failedCount,
    lastSyncedText,
    isOnline: metadata.currentStatus === 'ONLINE',
  };
}
