import {
  clearCompletedSyncItems,
  getFailedSyncItems,
  getPendingSyncItems,
  getSyncQueueStats,
  loadSyncQueue,
  saveSyncMetadata,
  updateSyncItem,
} from '../data/syncQueue';
import { SyncQueueItem, SyncQueueStats } from '../types/syncTypes';
import { networkStatusService } from './networkStatus';
import { defaultSyncTransport, SyncTransport } from './syncTransport';

export type SyncManagerListener = (stats: SyncQueueStats) => void;

class SyncManager {
  private isSyncing = false;
  private isInitialized = false;
  private listeners: Set<SyncManagerListener> = new Set();
  private transport: SyncTransport = defaultSyncTransport;
  private unsubscribeNetworkListener: (() => void) | null = null;
  private previousNetworkStatus: 'ONLINE' | 'OFFLINE' = 'ONLINE';

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Save initial metadata status
    const isOnline = networkStatusService.isOnline();
    await saveSyncMetadata({ currentStatus: isOnline ? 'ONLINE' : 'OFFLINE' });

    // Listen to network status changes
    this.unsubscribeNetworkListener = networkStatusService.subscribe(async (status) => {
      await saveSyncMetadata({ currentStatus: status });
      this.notifyListeners();

      // Trigger automatic sync on reconnection (OFFLINE -> ONLINE)
      if (this.previousNetworkStatus === 'OFFLINE' && status === 'ONLINE') {
        const pending = await getPendingSyncItems();
        if (pending.length > 0) {
          this.processSyncQueue();
        }
      }
      this.previousNetworkStatus = status;
    });
  }

  public subscribe(listener: SyncManagerListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current stats
    this.getStats().then((stats) => listener(stats));

    return () => {
      this.listeners.delete(listener);
    };
  }

  public async getStats(): Promise<SyncQueueStats> {
    const stats = await getSyncQueueStats();
    return {
      ...stats,
      isOnline: networkStatusService.isOnline(),
    };
  }

  public isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }

  public setTransport(customTransport: SyncTransport) {
    this.transport = customTransport;
  }

  /**
   * Manually trigger queue processing (e.g. from "Sync Now" button).
   */
  public async syncNow(): Promise<{ success: boolean; message: string; processedCount: number }> {
    if (!networkStatusService.isOnline()) {
      return {
        success: false,
        message: 'Device is offline. Records are saved locally and will sync when online.',
        processedCount: 0,
      };
    }

    if (this.isSyncing) {
      return {
        success: false,
        message: 'Sync is already in progress.',
        processedCount: 0,
      };
    }

    return await this.processSyncQueue();
  }

  /**
   * Process all pending queue items in FIFO order.
   */
  public async processSyncQueue(): Promise<{
    success: boolean;
    message: string;
    processedCount: number;
  }> {
    if (this.isSyncing) {
      return { success: false, message: 'Sync process already active.', processedCount: 0 };
    }

    if (!networkStatusService.isOnline()) {
      return {
        success: false,
        message: 'Cannot process queue while device is offline.',
        processedCount: 0,
      };
    }

    this.isSyncing = true;
    this.notifyListeners();

    let processedCount = 0;
    let failedCount = 0;

    try {
      const itemsToProcess = await getPendingSyncItems();

      if (itemsToProcess.length === 0) {
        this.isSyncing = false;
        this.notifyListeners();
        return {
          success: true,
          message: 'All offline data is already synchronized.',
          processedCount: 0,
        };
      }

      for (const item of itemsToProcess) {
        // Double check network availability before each item
        if (!networkStatusService.isOnline()) {
          break;
        }

        // Mark item as syncing
        await updateSyncItem(item.id, {
          status: 'syncing',
          lastAttemptAt: new Date().toISOString(),
        });
        this.notifyListeners();

        // Calculate backoff delay if retrying
        if (item.retryCount > 0) {
          const delayMs = Math.min(1000 * Math.pow(2, item.retryCount - 1), 8000);
          await new Promise((res) => setTimeout(res, delayMs));
        }

        const result = await this.transport.uploadSyncItem(item);

        if (result.success) {
          await updateSyncItem(item.id, {
            status: 'synced',
            lastError: undefined,
          });
          processedCount++;
        } else {
          failedCount++;
          const nextRetryCount = item.retryCount + 1;
          const isMaxRetriesReached = nextRetryCount >= 3;

          await updateSyncItem(item.id, {
            status: isMaxRetriesReached ? 'failed' : 'pending',
            retryCount: nextRetryCount,
            lastError: result.error || 'Sync attempt failed.',
          });
        }

        this.notifyListeners();
      }

      const now = new Date().toISOString();
      if (processedCount > 0) {
        await saveSyncMetadata({
          lastSuccessfulSyncAt: now,
          lastAttemptAt: now,
        });
      } else {
        await saveSyncMetadata({ lastAttemptAt: now });
      }

      const finalMsg =
        failedCount === 0
          ? `Successfully processed ${processedCount} offline record(s).`
          : `Processed ${processedCount} item(s), ${failedCount} item(s) require retry.`;

      return {
        success: failedCount === 0,
        message: finalMsg,
        processedCount,
      };
    } catch (err) {
      console.error('Unexpected error during sync processing:', err);
      return {
        success: false,
        message: 'An unexpected error occurred during synchronization.',
        processedCount,
      };
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  /**
   * Reset retry count for failed items and attempt re-syncing.
   */
  public async retryFailedItems(): Promise<{ success: boolean; message: string }> {
    const failedItems = await getFailedSyncItems();
    if (failedItems.length === 0) {
      return { success: true, message: 'No failed sync items to retry.' };
    }

    for (const item of failedItems) {
      await updateSyncItem(item.id, {
        status: 'pending',
        retryCount: 0,
        lastError: undefined,
      });
    }

    this.notifyListeners();
    const result = await this.processSyncQueue();
    return { success: result.success, message: result.message };
  }

  /**
   * Clear completed synced items from storage.
   */
  public async clearCompleted(): Promise<void> {
    await clearCompletedSyncItems();
    this.notifyListeners();
  }

  public destroy() {
    if (this.unsubscribeNetworkListener) {
      this.unsubscribeNetworkListener();
      this.unsubscribeNetworkListener = null;
    }
    this.isInitialized = false;
  }

  private async notifyListeners() {
    const stats = await this.getStats();
    this.listeners.forEach((listener) => {
      try {
        listener(stats);
      } catch (err) {
        console.error('Error notifying sync listener:', err);
      }
    });
  }
}

export const syncManager = new SyncManager();
