import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { CitizenReport } from '@/src/types/admin';
import { categoryLabels } from '@/src/data/citizenReportMockData';
import ReportStatusBadge from './ReportStatusBadge';
import ReportPriorityBadge from './ReportPriorityBadge';
import ReportImage from './ReportImage';

interface CitizenReportCardProps {
  report: CitizenReport;
  onAssign: (report: CitizenReport) => void;
  onReassign: (report: CitizenReport) => void;
  onUpdateStatus: (report: CitizenReport) => void;
  onVerify: (report: CitizenReport) => void;
  onViewImage: (report: CitizenReport) => void;
}

export default function CitizenReportCard({
  report,
  onAssign,
  onReassign,
  onUpdateStatus,
  onVerify,
  onViewImage,
}: CitizenReportCardProps) {
  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      water_supply: 'water-outline',
      sanitation: 'leaf-outline',
      electricity: 'flash-outline',
      road_damage: 'construct-outline',
      garbage: 'trash-outline',
      public_safety: 'shield-outline',
      noise: 'volume-high-outline',
      other: 'document-text-outline',
    };
    return icons[category] || 'document-text-outline';
  };

  const renderActions = () => {
    switch (report.status) {
      case 'pending_verification':
        return (
          <TouchableOpacity
            style={styles.assignBtn}
            activeOpacity={0.6}
            onPress={() => onAssign(report)}
          >
            <Text style={styles.assignBtnText}>Assign</Text>
          </TouchableOpacity>
        );
      case 'assigned':
        return (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.trackBtn}
              activeOpacity={0.6}
              onPress={() => onReassign(report)}
            >
              <Text style={styles.trackBtnText}>Reassign</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateBtn}
              activeOpacity={0.6}
              onPress={() => onUpdateStatus(report)}
            >
              <Text style={styles.updateBtnText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        );
      case 'under_investigation':
        return (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.trackBtn}
              activeOpacity={0.6}
              onPress={() => onUpdateStatus(report)}
            >
              <Text style={styles.trackBtnText}>Track Investigation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.verifyBtn}
              activeOpacity={0.6}
              onPress={() => onVerify(report)}
            >
              <Text style={styles.verifyBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        );
      case 'verified':
        return (
          <TouchableOpacity
            style={styles.updateBtn}
            activeOpacity={0.6}
            onPress={() => onUpdateStatus(report)}
          >
            <Text style={styles.updateBtnText}>Resolve</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Text style={styles.reportId}>{report.id}</Text>
          <ReportStatusBadge status={report.status} />
        </View>
        <ReportPriorityBadge priority={report.priority} />
      </View>

      {/* Title */}
      <Text style={styles.title}>{report.title}</Text>

      {/* Info row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{report.citizenName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.infoText} numberOfLines={1}>
            {report.area}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name={getCategoryIcon(report.category)} size={12} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{categoryLabels[report.category]}</Text>
        </View>
        {report.imageUri && (
          <ReportImage imageUri={report.imageUri} onPress={() => onViewImage(report)} />
        )}
      </View>

      {/* Actions */}
      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportId: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  assignBtn: {
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  assignBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
  trackBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
  updateBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  verifyBtn: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});
