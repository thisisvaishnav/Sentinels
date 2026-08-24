import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { SyncQueueItem } from '../../types/syncTypes';

interface SyncQueueItemCardProps {
  item: SyncQueueItem;
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export const SyncQueueItemCard: React.FC<SyncQueueItemCardProps> = ({
  item,
  onRetry,
  onRemove,
}) => {
  const getEntityIcon = () => {
    switch (item.entityType) {
      case 'household':
        return <MaterialCommunityIcons name="home-city-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />;
      case 'survey':
        return <MaterialCommunityIcons name="clipboard-check-outline" size={18} color="#6366F1" />;
      case 'missing_report':
        return <MaterialCommunityIcons name="alert-decagram-outline" size={18} color="#F59E0B" />;
      case 'verification':
        return <MaterialCommunityIcons name="shield-check-outline" size={18} color="#10B981" />;
      case 'anomaly_escalation':
        return <MaterialCommunityIcons name="shield-alert-outline" size={18} color={ENUMERATOR_THEME.colors.warningText} />;
      default:
        return <MaterialCommunityIcons name="database-sync-outline" size={18} color={ENUMERATOR_THEME.colors.textMuted} />;
    }
  };

  const getEntityLabel = () => {
    switch (item.entityType) {
      case 'household':
        return 'Household Registration';
      case 'survey':
        return 'Field Survey Data';
      case 'missing_report':
        return 'Missing Report';
      case 'verification':
        return 'Household Verification';
      case 'anomaly_escalation':
        return 'Supervisor Escalation';
      default:
        return 'Sync Record';
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'pending':
        return (
          <View style={[styles.statusBadge, styles.badgePending]}>
            <Ionicons name="time-outline" size={12} color={ENUMERATOR_THEME.colors.warningText} />
            <Text style={[styles.statusText, { color: ENUMERATOR_THEME.colors.warningText }]}>Pending</Text>
          </View>
        );
      case 'syncing':
        return (
          <View style={[styles.statusBadge, styles.badgeSyncing]}>
            <Ionicons name="sync-outline" size={12} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={[styles.statusText, { color: ENUMERATOR_THEME.colors.accent }]}>Syncing</Text>
          </View>
        );
      case 'synced':
        return (
          <View style={[styles.statusBadge, styles.badgeSynced]}>
            <Ionicons name="checkmark-circle-outline" size={12} color={ENUMERATOR_THEME.colors.successText} />
            <Text style={[styles.statusText, { color: ENUMERATOR_THEME.colors.successText }]}>Synced</Text>
          </View>
        );
      case 'failed':
        return (
          <View style={[styles.statusBadge, styles.badgeFailed]}>
            <Ionicons name="close-circle-outline" size={12} color={ENUMERATOR_THEME.colors.dangerText} />
            <Text style={[styles.statusText, { color: ENUMERATOR_THEME.colors.dangerText }]}>Failed</Text>
          </View>
        );
    }
  };

  const formattedDate = new Date(item.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.entityTitleWrap}>
          <View style={styles.iconBox}>{getEntityIcon()}</View>
          <View style={styles.titleWrap}>
            <Text style={styles.entityLabel}>{getEntityLabel()}</Text>
            <Text style={styles.recordId} numberOfLines={1} ellipsizeMode="middle">
              ID: {item.recordId}
            </Text>
          </View>
        </View>

        {getStatusBadge()}
      </View>

      {/* Detail Metadata Row */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Operation: <Text style={styles.metaValue}>{item.operation.toUpperCase()}</Text></Text>
        <Text style={styles.metaText}>Queued: <Text style={styles.metaValue}>{formattedDate}</Text></Text>
        {item.retryCount > 0 && (
          <Text style={styles.metaText}>Retries: <Text style={styles.metaValue}>{item.retryCount}</Text></Text>
        )}
      </View>

      {/* Error Banner */}
      {item.status === 'failed' && item.lastError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={14} color={ENUMERATOR_THEME.colors.dangerText} />
          <Text style={styles.errorText} numberOfLines={2}>
            {item.lastError}
          </Text>
        </View>
      )}

      {/* Action Footer */}
      {item.status === 'failed' && onRetry && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => onRetry(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.retryBtnText}>Retry Upload</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  entityTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 1,
  },
  entityLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  recordId: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  badgePending: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  badgeSyncing: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  badgeSynced: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  badgeFailed: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.borderSubtle,
    paddingTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  metaValue: {
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.dangerText,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
