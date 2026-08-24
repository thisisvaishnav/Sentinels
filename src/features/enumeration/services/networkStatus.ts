export type NetworkStatusType = 'ONLINE' | 'OFFLINE';

export type NetworkStatusListener = (status: NetworkStatusType) => void;

class NetworkStatusService {
  private currentStatus: NetworkStatusType = 'ONLINE';
  private listeners: Set<NetworkStatusListener> = new Set();
  private pingIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startMonitoring();
  }

  public getStatus(): NetworkStatusType {
    return this.currentStatus;
  }

  public isOnline(): boolean {
    return this.currentStatus === 'ONLINE';
  }

  public setStatus(status: NetworkStatusType) {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.notifyListeners();
    }
  }

  public toggleStatus(): NetworkStatusType {
    const nextStatus = this.currentStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    this.setStatus(nextStatus);
    return nextStatus;
  }

  public subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Call immediately with current status
    listener(this.currentStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentStatus);
      } catch (err) {
        console.error('Error in network status listener:', err);
      }
    });
  }

  private startMonitoring() {
    // Check initial environment
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      this.currentStatus = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    }
  }

  public stopMonitoring() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }
}

export const networkStatusService = new NetworkStatusService();
