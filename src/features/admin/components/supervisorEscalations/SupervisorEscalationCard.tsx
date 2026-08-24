import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { SupervisorEscalationItem } from '../../types/supervisorEscalationTypes';

interface SupervisorEscalationCardProps {
  item: SupervisorEscalationItem;
  onReview: (id: string) => void;
}

export const SupervisorEscalationCard: React.FC<SupervisorEscalationCardProps> = ({
  item,
  onReview,
}) => {
  const getPriorityStyle = (priority: SupervisorEscalationItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return { bg: COLORS.dangerSoft, text: COLORS.danger, label: 'URGENT' };
      case 'high':
        return { bg: COLORS.warningSoft, text: COLORS.warning, label: 'HIGH' };
      case 'normal':
      default:
        return { bg: COLORS.accentSoft, text: COLORS.accent, label: 'NORMAL' };
    }
  };

  const getStatusBadge = (status: SupervisorEscalationItem['status']) => {
    switch (status) {
      case 'pending':
        return { bg: COLORS.warningSoft, text: COLORS.warning, label: 'PENDING REVIEW' };
      case 'in-review':
        return { bg: COLORS.infoSoft, text: COLORS.info, label: 'IN REVIEW' };
      case 'assigned':
        return { bg: COLORS.primarySoft, text: COLORS.primary, label: 'ASSIGNED' };
      case 'resolved':
        return { bg: COLORS.successSoft, text: COLORS.success, label: 'RESOLVED' };
      case 'rejected':
        return { bg: COLORS.dangerSoft, text: COLORS.danger, label: 'REJECTED' };
    }
  };

  const priStyle = getPriorityStyle(item.priority);
  const statusBadge = getStatusBadge(item.status);

  const formattedDate = new Date(item.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priStyle.text }]}>{priStyle.label}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
            <Text style={[styles.statusText, { color: statusBadge.text }]}>{statusBadge.label}</Text>
          </View>
        </View>

        <Text style={styles.timeText}>{formattedDate}</Text>
      </View>

      {/* Main Details */}
      <View style={styles.mainInfo}>
        <View style={styles.titleWrap}>
          <Text style={styles.escalationId}>{item.id}</Text>
          <Text style={styles.householdIdText}>HH: {item.householdId}</Text>
        </View>

        <Text style={styles.headText}>Head: {item.householdHead} · {item.locality}</Text>

        <View style={styles.anomalyBox}>
          <MaterialCommunityIcons name="alert-circle-outline" size={15} color={COLORS.warning} />
          <Text style={styles.anomalyText} numberOfLines={1}>
            {item.anomalyTitle} ({item.anomalySeverity.toUpperCase()})
          </Text>
        </View>

        <View style={styles.actionBox}>
          <MaterialCommunityIcons name="shield-account-outline" size={15} color={COLORS.accent} />
          <Text style={styles.actionText}>
            Requested: <Text style={styles.actionHighlight}>{item.requestedAction.replace('-', ' ').toUpperCase()}</Text>
          </Text>
        </View>
      </View>

      {/* Footer Info & Action */}
      <View style={styles.cardFooter}>
        <View style={styles.enumInfo}>
          <Ionicons name="person-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.enumText}>{item.enumeratorName} ({item.enumeratorId})</Text>
        </View>

        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => onReview(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.reviewBtnText}>Review</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.textOnPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  mainInfo: {
    gap: 4,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  escalationId: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  householdIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accent,
  },
  headText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  anomalyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  anomalyText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionHighlight: {
    fontWeight: '700',
    color: COLORS.accent,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
  },
  enumInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enumText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
