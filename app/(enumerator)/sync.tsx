import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { syncManager } from '@/src/features/enumeration/services/syncManager';
import { networkStatusService } from '@/src/features/enumeration/services/networkStatus';
import { loadSyncQueue } from '@/src/features/enumeration/data/syncQueue';
import { SyncQueueItem, SyncQueueStats, SyncStatus } from '@/src/features/enumeration/types/syncTypes';
import { SyncQueueItemCard } from '@/src/features/enumeration/components/sync/SyncQueueItemCard';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

type FilterTab = 'All' | 'pending' | 'synced' | 'failed';

export default function EnumeratorSyncScreen() {
  const router = useRouter();
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [stats, setStats] = useState<SyncQueueStats>({
    totalCount: 0,
    pendingCount: 0,
    syncingCount: 0,
    syncedCount: 0,
    failedCount: 0,
    lastSyncedText: 'Never',
    isOnline: true,
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const reloadData = useCallback(async () => {
    try {
      const currentQueue = await loadSyncQueue();
      const currentStats = await syncManager.getStats();
      setQueue(currentQueue);
      setStats(currentStats);
      setIsSyncing(syncManager.isCurrentlySyncing());
    } catch (err) {
      console.error('Failed to load sync screen data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncManager.initialize();
    reloadData();

    const unsubscribe = syncManager.subscribe(() => {
      reloadData();
    });

    return () => {
      unsubscribe();
    };
  }, [reloadData]);

  const handleSyncNow = async () => {
    if (!stats.isOnline) {
      Alert.alert('Offline Mode', 'Device is offline. Saved records will sync when reconnected.');
      return;
    }

    if (stats.pendingCount === 0 && stats.failedCount === 0) {
      Alert.alert('Sync Status', 'All records are up to date!');
      return;
    }

    setIsSyncing(true);
    const result = await syncManager.syncNow();
    setIsSyncing(false);
    Alert.alert('Sync Processed', result.message);
  };

  const handleRetryFailed = async () => {
    if (stats.failedCount === 0) {
      Alert.alert('Retry Status', 'There are no failed items in the queue.');
      return;
    }

    setIsSyncing(true);
    const result = await syncManager.retryFailedItems();
    setIsSyncing(false);
    Alert.alert('Retry Result', result.message);
  };

  const handleClearCompleted = async () => {
    await syncManager.clearCompleted();
    Alert.alert('Cleared', 'Completed sync items removed from queue view.');
  };

  const handleSingleRetry = async (itemId: string) => {
    setIsSyncing(true);
    const result = await syncManager.retryFailedItems();
    setIsSyncing(false);
    Alert.alert('Retry Result', result.message);
  };

  const handleToggleOnline = () => {
    const nextStatus = networkStatusService.toggleStatus();
    Alert.alert('Network State', `Switched to ${nextStatus === 'ONLINE' ? 'Online 🌐' : 'Offline 📡'}`);
  };

  const filteredQueue = queue.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Offline Sync Manager</Text>
          <Text style={styles.headerSubTitle}>Centralized Queue & Transport</Text>
        </View>

        <TouchableOpacity onPress={handleToggleOnline} activeOpacity={0.7}>
          <View
            style={[
              styles.networkBadge,
              stats.isOnline ? styles.badgeOnline : styles.badgeOffline,
            ]}
          >
            <View
              style={[
                styles.dot,
                stats.isOnline ? styles.dotOnline : styles.dotOffline,
              ]}
            />
            <Text
              style={[
                styles.networkText,
                stats.isOnline ? styles.textOnline : styles.textOffline,
              ]}
            >
              {stats.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Offline Banner Warning */}
        {!stats.isOnline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={20} color={ENUMERATOR_THEME.colors.warningText} />
            <Text style={styles.offlineBannerText}>
              You are offline. Changes remain safely stored on this device and will sync automatically when connectivity returns.
            </Text>
          </View>
        )}

        {/* Horizontal Metric Summary Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsScrollContent}
        >
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Items</Text>
            <Text style={styles.metricValue}>{stats.totalCount}</Text>
          </View>

          <View style={[styles.metricCard, styles.cardPending]}>
            <Text style={styles.metricLabel}>Pending</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.warningText }]}>
              {stats.pendingCount}
            </Text>
          </View>

          <View style={[styles.metricCard, styles.cardSynced]}>
            <Text style={styles.metricLabel}>Synced</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.successText }]}>
              {stats.syncedCount}
            </Text>
          </View>

          <View style={[styles.metricCard, styles.cardFailed]}>
            <Text style={styles.metricLabel}>Failed</Text>
            <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.dangerText }]}>
              {stats.failedCount}
            </Text>
          </View>
        </ScrollView>

        {/* Action Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnPrimary, (isSyncing || !stats.isOnline) && styles.btnDisabled]}
            onPress={handleSyncNow}
            disabled={isSyncing || !stats.isOnline}
            activeOpacity={0.8}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.textWhite} />
            ) : (
              <MaterialCommunityIcons name="cloud-upload" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
            )}
            <Text style={styles.btnPrimaryText}>{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSecondary, stats.failedCount === 0 && styles.btnDisabled]}
            onPress={handleRetryFailed}
            disabled={stats.failedCount === 0 || isSyncing}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={16} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.btnSecondaryText}>Retry Failed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSubtle, stats.syncedCount === 0 && styles.btnDisabled]}
            onPress={handleClearCompleted}
            disabled={stats.syncedCount === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color={ENUMERATOR_THEME.colors.textSecondary} />
            <Text style={styles.btnSubtleText}>Clear Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills Bar */}
        <View style={styles.filterBar}>
          {(['All', 'pending', 'synced', 'failed'] as FilterTab[]).map((tab) => {
            const isActive = activeFilter === tab;
            const tabCount =
              tab === 'All'
                ? queue.length
                : queue.filter((i) => i.status === tab).length;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tabCount})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Queue List / Empty State */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.loadingText}>Loading sync queue...</Text>
          </View>
        ) : filteredQueue.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="cloud-check" size={38} color={ENUMERATOR_THEME.colors.success} />
            <Text style={styles.emptyTitle}>Everything is Synchronized</Text>
            <Text style={styles.emptySubtitle}>
              {queue.length === 0
                ? 'No pending offline uploads in the queue.'
                : `No queue records found for filter "${activeFilter}".`}
            </Text>
          </View>
        ) : (
          <View style={styles.queueList}>
            {filteredQueue.map((item) => (
              <SyncQueueItemCard key={item.id} item={item} onRetry={handleSingleRetry} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  headerSubTitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  badgeOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  badgeOffline: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotOffline: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textOnline: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  textOffline: {
    color: ENUMERATOR_THEME.colors.warningText,
  },
  scrollBody: {
    paddingVertical: 12,
    gap: 14,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  offlineBannerText: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.warningText,
    lineHeight: 16,
  },
  metricsScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  metricCard: {
    minWidth: 100,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  cardPending: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  cardSynced: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  cardFailed: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
  },
  metricLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  btnPrimary: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  btnPrimaryText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  btnSecondaryText: {
    color: ENUMERATOR_THEME.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  btnSubtle: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  btnSubtleText: {
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontWeight: '700',
  },
  loadingWrap: {
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  emptyCard: {
    marginHorizontal: 16,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  queueList: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
