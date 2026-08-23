import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlindSpotItem, BlindSpotSeverity } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotCardProps {
  item: BlindSpotItem;
  onViewArea: (areaId: string) => void;
  onViewMap: (areaId: string) => void;
  onStartSurvey: (householdId?: string) => void;
  onOpenDetail: (item: BlindSpotItem) => void;
}

export const BlindSpotCard: React.FC<BlindSpotCardProps> = ({
  item,
  onViewArea,
  onViewMap,
  onStartSurvey,
  onOpenDetail,
}) => {
  const getSeverityStyle = (severity: BlindSpotSeverity) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL RISK',
          color: ENUMERATOR_THEME.colors.danger,
          bg: '#FEF2F2',
          border: '#FCA5A5',
          icon: 'alert-decagram',
        };
      case 'high':
        return {
          label: 'HIGH RISK',
          color: ENUMERATOR_THEME.colors.warning,
          bg: '#FFFBEB',
          border: '#FCD34D',
          icon: 'alert-triangle',
        };
      case 'medium':
        return {
          label: 'MEDIUM RISK',
          color: '#2563EB',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          icon: 'shield-alert-outline',
        };
      default:
        return {
          label: 'LOW RISK',
          color: ENUMERATOR_THEME.colors.success,
          bg: '#ECFDF5',
          border: '#A7F3D0',
          icon: 'check-circle-outline',
        };
    }
  };

  const sev = getSeverityStyle(item.severity);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onOpenDetail(item)}
      activeOpacity={0.9}
    >
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.areaWrap}>
          <Text style={styles.areaName}>{item.areaName}</Text>
          <Text style={styles.areaSub}>
            ID: {item.areaId} · {item.ward}
          </Text>
        </View>

        <View style={[styles.severityBadge, { backgroundColor: sev.bg, borderColor: sev.border }]}>
          <MaterialCommunityIcons name={sev.icon as any} size={12} color={sev.color} />
          <Text style={[styles.severityText, { color: sev.color }]}>{sev.label}</Text>
        </View>
      </View>

      {/* Progress Bar & Coverage */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Coverage Progress</Text>
          <Text style={[styles.progressPercent, { color: sev.color }]}>
            {item.coveragePercent}%
          </Text>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${item.coveragePercent}%`,
                backgroundColor: sev.color,
              },
            ]}
          />
        </View>
      </View>

      {/* Metric Breakdown */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>Total</Text>
          <Text style={styles.metricValue}>{item.totalHouseholds}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.success }]}>
            {item.completedHouseholds}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricCell}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={[styles.metricValue, { color: item.remainingHouseholds > 0 ? sev.color : ENUMERATOR_THEME.colors.success }]}>
            {item.remainingHouseholds}
          </Text>
        </View>
      </View>

      {/* Signals Badges */}
      <View style={styles.signalsRow}>
        {item.priorityHouseholdsCount > 0 && (
          <View style={styles.signalBadge}>
            <MaterialCommunityIcons name="flag-outline" size={12} color={ENUMERATOR_THEME.colors.danger} />
            <Text style={styles.signalText}>{item.priorityHouseholdsCount} High Priority</Text>
          </View>
        )}

        {item.needsVerificationCount > 0 && (
          <View style={styles.signalBadge}>
            <MaterialCommunityIcons name="file-document-edit-outline" size={12} color="#2563EB" />
            <Text style={styles.signalText}>{item.needsVerificationCount} Unverified</Text>
          </View>
        )}

        {item.missingReportsCount > 0 && (
          <View style={styles.signalBadge}>
            <MaterialCommunityIcons name="alert-circle-outline" size={12} color={ENUMERATOR_THEME.colors.warning} />
            <Text style={styles.signalText}>{item.missingReportsCount} Missing</Text>
          </View>
        )}
      </View>

      {/* Reason Box */}
      <View style={styles.reasonBox}>
        <MaterialCommunityIcons name="information-outline" size={15} color={ENUMERATOR_THEME.colors.textSecondary} />
        <Text style={styles.reasonText} numberOfLines={2}>
          {item.reason}
        </Text>
      </View>

      {/* Recommended Next Household Action */}
      {item.recommendedNextHouseholdId && (
        <View style={styles.nextHHBox}>
          <View style={styles.nextHHInfo}>
            <Text style={styles.nextHHLabel}>Recommended Next Target:</Text>
            <Text style={styles.nextHHName}>
              {item.recommendedNextHeadName || 'Household Head'} ({item.recommendedNextHouseholdId})
            </Text>
          </View>

          <TouchableOpacity
            style={styles.surveyBtn}
            onPress={() => onStartSurvey(item.recommendedNextHouseholdId)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="clipboard-text-play-outline" size={16} color="#FFFFFF" />
            <Text style={styles.surveyBtnText}>Survey</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contextual Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={() => onViewArea(item.areaId)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="map-marker-path" size={15} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.actionBtnSecondaryText}>View Area</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={() => onViewMap(item.areaId)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="map-search-outline" size={15} color={ENUMERATOR_THEME.colors.textSecondary} />
          <Text style={styles.actionBtnSecondaryText}>View GIS Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => onOpenDetail(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  areaWrap: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  areaSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
  },
  progressSection: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  metricCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
  metricLabel: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  signalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  signalText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 10,
    gap: 6,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 17,
  },
  nextHHBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    gap: 8,
  },
  nextHHInfo: {
    flex: 1,
  },
  nextHHLabel: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  nextHHName: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  surveyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  surveyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingVertical: 8,
    gap: 4,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  detailsBtn: {
    width: 34,
    height: 34,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
