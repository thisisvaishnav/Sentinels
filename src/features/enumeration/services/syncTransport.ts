import { SyncQueueItem } from '../types/syncTypes';

export interface SyncTransportResult {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface SyncTransport {
  uploadSyncItem(item: SyncQueueItem): Promise<SyncTransportResult>;
}

/**
 * Development / Mock Transport implementation.
 * Simulates local processing and transport boundary without calling non-existent backend APIs.
 * Clearly communicates that records are saved locally and ready for server sync.
 */
export class MockSyncTransport implements SyncTransport {
  private simulateFailures: boolean;

  constructor(options?: { simulateFailures?: boolean }) {
    this.simulateFailures = options?.simulateFailures ?? false;
  }

  async uploadSyncItem(item: SyncQueueItem): Promise<SyncTransportResult> {
    // Artificial latency for realistic queue processing feel (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (this.simulateFailures && Math.random() < 0.3) {
      return {
        success: false,
        error: 'Simulated network timeout during mock sync.',
        statusCode: 504,
      };
    }

    return {
      success: true,
      message: `Processed locally for record ${item.recordId} (${item.entityType}). Ready for server sync.`,
      statusCode: 200,
    };
  }
}

// Default exported transport singleton
export const defaultSyncTransport = new MockSyncTransport();
