import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';
import { HouseholdAnomaly } from '../../types/anomalyTypes';

interface AnomalyCardProps {
  anomaly: HouseholdAnomaly;
  onSelect: (anomaly: HouseholdAnomaly) => void;
  onToggleReview: (id: string) => void;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({
  anomaly,
  onSelect,
  onToggleReview,
}) => {
  const router = useRouter();

  const getSeverityStyle = (severity: HouseholdAnomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
          badgeBg: '#EF4444',
          label: 'CRITICAL',
        };
      case 'high':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#B45309',
          badgeBg: '#D97706',
          label: 'HIGH',
        };
      case 'medium':
        return {
          bg: '#F0F9FF',
          border: '#BAE6FD',
          text: '#0369A1',
          badgeBg: '#0284C7',
          label: 'MEDIUM',
        };
      case 'low':
      default:
        return {
          bg: '#F8FAFC',
          border: '#CBD5E1',
          text: '#475569',
          badgeBg: '#64748B',
          label: 'LOW',
        };
    }
  };

  const sevStyle = getSeverityStyle(anomaly.severity);

  const handleReviewHousehold = () => {
    router.push({
      pathname: '/(enumerator)/start-survey',
      params: { householdId: anomaly.householdId },
    });
  };

  const handleViewMap = () => {
    router.push('/(enumerator)/gis-map');
  };

  const hasCoords = typeof anomaly.latitude === 'number' && typeof anomaly.longitude === 'number';

  return (
    <TouchableOpacity
      style={[styles.card, anomaly.reviewed && styles.cardReviewed]}
      onPress={() => onSelect(anomaly)}
      activeOpacity={0.85}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.sevBadge, { backgroundColor: sevStyle.badgeBg }]}>
            <Text style={styles.sevBadgeText}>{sevStyle.label}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{anomaly.type.replace('-', ' ')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.reviewBtn, anomaly.reviewed && styles.reviewBtnActive]}
          onPress={() => onToggleReview(anomaly.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={anomaly.reviewed ? 'checkmark-circle' : 'ellipse-outline'}
            size={14}
            color={anomaly.reviewed ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.textMuted}
          />
          <Text style={[styles.reviewBtnText, anomaly.reviewed && styles.reviewBtnTextActive]}>
            {anomaly.reviewed ? 'Reviewed' : 'Mark Reviewed'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Anomaly Title */}
      <Text style={styles.title}>{anomaly.title}</Text>

      {/* Household Metadata */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="card-account-details-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.metaId}>{anomaly.householdId}</Text>
        </View>
        {anomaly.headName && (
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={13} color={ENUMERATOR_THEME.colors.textMuted} />
            <Text style={styles.metaText}>{anomaly.headName}</Text>
          </View>
        )}
        {anomaly.areaName && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={ENUMERATOR_THEME.colors.textMuted} />
            <Text style={styles.metaText}>{anomaly.areaName}</Text>
          </View>
        )}
      </View>

      {/* Description & Reason */}
      <Text style={styles.description}>{anomaly.description}</Text>

      <View style={[styles.reasonBox, { backgroundColor: sevStyle.bg, borderColor: sevStyle.border }]}>
        <MaterialCommunityIcons name="information-outline" size={14} color={sevStyle.text} />
        <Text style={[styles.reasonText, { color: sevStyle.text }]}>
          <Text style={{ fontWeight: '700' }}>Reason: </Text>
          {anomaly.reason}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleReviewHousehold} activeOpacity={0.8}>
          <Ionicons name="clipboard-outline" size={14} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.actionBtnPrimaryText}>Review Household</Text>
        </TouchableOpacity>

        {hasCoords && (
          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleViewMap} activeOpacity={0.8}>
            <Ionicons name="map-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.actionBtnSecondaryText}>View Map</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
    marginHorizontal: 16,
  },
  cardReviewed: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sevBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  sevBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  typeBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  typeBadgeText: {
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  reviewBtnActive: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  reviewBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  reviewBtnTextActive: {
    color: ENUMERATOR_THEME.colors.successText,
    fontWeight: '700',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaId: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  metaText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  actionBtnPrimaryText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  actionBtnSecondaryText: {
    color: ENUMERATOR_THEME.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
